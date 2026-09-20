// QuizFly Chrome Extension - Popup Controller State Machine
const API_BASE_URL = typeof chrome !== 'undefined' && chrome.runtime?.getManifest()?.update_url
  ? 'https://quizfly.com'
  : 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const domainText = document.getElementById('domain-text');
  const statePreview = document.getElementById('state-preview');
  const stateGenerating = document.getElementById('state-generating');
  const stateQuiz = document.getElementById('state-quiz');
  const stateSummary = document.getElementById('state-summary');
  const stateError = document.getElementById('state-error');

  // Preview elements
  const sourceTypeBadge = document.getElementById('source-type-badge');
  const wordCountBadge = document.getElementById('word-count-badge');
  const previewTitle = document.getElementById('preview-title');
  const previewExcerpt = document.getElementById('preview-excerpt');
  const selectionAlert = document.getElementById('selection-alert');
  const btnGenerate = document.getElementById('btn-generate');

  // Generating elements
  const generationLog = document.getElementById('generation-log');
  const generationBar = document.getElementById('generation-bar');

  // Quiz elements
  const qCounter = document.getElementById('q-counter');
  const timerBadge = document.getElementById('timer-badge');
  const scoreTally = document.getElementById('score-tally');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const questionPrompt = document.getElementById('question-prompt');
  const optionsContainer = document.getElementById('options-container');
  const quoteDrawer = document.getElementById('quote-drawer');
  const quoteLocation = document.getElementById('quote-location');
  const sourceQuoteText = document.getElementById('source-quote-text');
  const btnNextQ = document.getElementById('btn-next-q');

  // Summary elements
  const finalGradeTitle = document.getElementById('final-grade-title');
  const finalScorePct = document.getElementById('final-score-pct');
  const finalScoreCount = document.getElementById('final-score-count');
  const finalTime = document.getElementById('final-time');
  const shareFeedbackBanner = document.getElementById('share-feedback-banner');
  const shareOnlineLink = document.getElementById('share-online-link');
  const btnShare = document.getElementById('btn-share');
  const btnRetake = document.getElementById('btn-retake');

  // Error elements
  const errorTitle = document.getElementById('error-title');
  const errorMessage = document.getElementById('error-message');
  const btnRetry = document.getElementById('btn-retry');
  const btnSampleQuiz = document.getElementById('btn-sample-quiz');

  // State Variables
  let pageContext = null;
  let currentQuiz = null;
  let currentQIndex = 0;
  let userAnswers = {};
  let elapsedSeconds = 0;
  let timerInterval = null;

  const LOG_STEPS = [
    'Extracting page text & semantics...',
    'Formulating active-recall question prompts...',
    'Synthesizing exact source quote citations...',
    'Finalizing QuizFly interactive bundle...'
  ];

  // 1. INITIAL MOUNT & DOM EXTRACTION
  initPopup();

  async function initPopup() {
    // Check if there is a pending selection stored from Context Menu
    try {
      const stored = await chrome.storage.local.get('quizfly_pending_selection');
      if (stored.quizfly_pending_selection) {
        const pending = stored.quizfly_pending_selection;
        // If selection stored within last 10 minutes
        if (Date.now() - pending.timestamp < 10 * 60 * 1000) {
          pageContext = pending;
          renderPreviewState();
          // Clear pending so subsequent clicks inspect current page
          chrome.storage.local.remove('quizfly_pending_selection');
          return;
        }
      }
    } catch (e) {
      console.warn('[QuizFly Popup] Storage check fallback:', e);
    }

    // Query active tab and send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        showError('NO ACTIVE TAB', 'Unable to detect active browser tab.');
        return;
      }

      const activeTab = tabs[0];
      const url = activeTab.url || '';

      // Check for chrome:// or edge:// system pages
      if (url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:')) {
        showError('SYSTEM PAGE DETECTED', 'QuizFly cannot extract content from internal browser system pages. Try navigating to any web article or news page!');
        return;
      }

      try {
        const parsedUrl = new URL(url);
        domainText.textContent = parsedUrl.hostname.replace(/^www\./, '');
      } catch {
        domainText.textContent = 'web-source';
      }

      // Send message to content script
      chrome.tabs.sendMessage(activeTab.id, { action: 'EXTRACT_PAGE_CONTENT' }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          // If content script was not injected yet, inject script dynamically and retry
          chrome.scripting.executeScript(
            { target: { tabId: activeTab.id }, files: ['scripts/content.js'] },
            () => {
              if (chrome.runtime.lastError) {
                // Fallback page context
                pageContext = {
                  title: activeTab.title || 'Current Web Page',
                  url: url,
                  domain: domainText.textContent,
                  text: 'Web page text extracted for active recall generation.',
                  isSelection: false,
                  wordCount: 350
                };
                renderPreviewState();
                return;
              }

              // Retry message after injection
              chrome.tabs.sendMessage(activeTab.id, { action: 'EXTRACT_PAGE_CONTENT' }, (retryRes) => {
                if (retryRes && retryRes.data) {
                  pageContext = retryRes.data;
                } else {
                  pageContext = {
                    title: activeTab.title || 'Current Page',
                    url: url,
                    domain: domainText.textContent,
                    text: 'Extracted active recall context.',
                    isSelection: false,
                    wordCount: 400
                  };
                }
                renderPreviewState();
              });
            }
          );
        } else {
          pageContext = response.data;
          renderPreviewState();
        }
      });
    });
  }

  function renderPreviewState() {
    if (!pageContext) return;

    domainText.textContent = pageContext.domain || 'web-source';
    previewTitle.textContent = pageContext.title;
    previewExcerpt.textContent = `"${pageContext.text.slice(0, 180)}..."`;
    wordCountBadge.textContent = `${pageContext.wordCount} WORDS`;

    if (pageContext.isSelection) {
      sourceTypeBadge.textContent = '⚡ SELECTION TEXT';
      sourceTypeBadge.className = 'badge badge-pink';
      selectionAlert.classList.remove('hidden');
    } else {
      sourceTypeBadge.textContent = '📄 PAGE ARTICLE';
      sourceTypeBadge.className = 'badge badge-yellow';
      selectionAlert.classList.add('hidden');
    }

    switchState('preview');
  }

  // 2. GENERATION PIPELINE
  btnGenerate.addEventListener('click', () => {
    generateQuiz();
  });

  btnRetry.addEventListener('click', () => {
    generateQuiz();
  });

  btnSampleQuiz.addEventListener('click', () => {
    loadFallbackMockQuiz();
  });

  async function generateQuiz() {
    if (!pageContext) return;

    switchState('generating');
    let logIndex = 0;
    generationLog.textContent = LOG_STEPS[0];
    generationBar.style.width = '25%';

    const logInterval = setInterval(() => {
      logIndex++;
      if (logIndex < LOG_STEPS.length) {
        generationLog.textContent = LOG_STEPS[logIndex];
        generationBar.style.width = `${((logIndex + 1) / LOG_STEPS.length) * 100}%`;
      }
    }, 500);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: pageContext.url,
          title: pageContext.title,
          text: pageContext.text,
          topic: pageContext.title
        })
      });

      const data = await response.json().catch(() => ({}));
      clearInterval(logInterval);

      if (response.ok && data.success && data.quiz && data.quiz.questions && data.quiz.questions.length > 0) {
        currentQuiz = data.quiz;
        startQuizEngine();
        return;
      }

      const errMsg = data.error || `The QuizFly API server returned an empty or invalid response. Check ${API_BASE_URL}/api/generate`;
      const title = data.isConfigError ? 'LLM API KEY MISSING' : 'GENERATION FAILED';
      showError(title, errMsg);

    } catch (err) {
      console.error('[QuizFly Extension] API request failed:', err);
      clearInterval(logInterval);
      showError('GENERATOR OFFLINE', `The generator server is offline or unreachable at ${API_BASE_URL}/api/generate. Make sure your Next.js server is running!`);
    }
  }

  function loadFallbackMockQuiz() {
    currentQuiz = {
      id: 'ext-' + Date.now(),
      title: pageContext ? pageContext.title : 'Active Recall Master Quiz',
      sourceUrl: pageContext ? pageContext.url : 'https://quizfly.com',
      sourceDomain: pageContext ? pageContext.domain : 'quizfly.com',
      category: 'Web Science',
      timeAgo: 'Just now',
      avgScore: 88,
      estMinutes: 3,
      createdAt: new Date().toISOString(),
      questions: [
        {
          id: 'q1',
          prompt: `What is the core active-recall mechanism for retaining content from ${pageContext ? pageContext.domain : 'web articles'}?`,
          options: [
            { id: 'opt1', text: 'Retrieval testing reconstructs memory traces, boosting neural retention.' },
            { id: 'opt2', text: 'Passive highlighting with fluorescent markers creates visual anchors.' },
            { id: 'opt3', text: 'Re-reading articles 5 times consecutively in a single session.' },
            { id: 'opt4', text: 'Scrolling through summary headings without answering prompts.' }
          ],
          correctOptionId: 'opt1',
          sourceQuote: `Extracted from ${pageContext ? pageContext.domain : 'article'}: Active retrieval forces the brain to reconstruct memory traces, yielding dramatically higher long-term retention than passive reading.`,
          quoteLocation: 'Section 1: Active Recall Retention'
        },
        {
          id: 'q2',
          prompt: 'Why does feeling cognitive difficulty during quiz testing improve long-term memory?',
          options: [
            { id: 'opt1', text: 'Cognitive friction signals active neural pathway encoding (Desirable Difficulty).' },
            { id: 'opt2', text: 'It lowers dopamine levels to enforce strict focus.' },
            { id: 'opt3', text: 'It bypasses working memory storage completely.' },
            { id: 'opt4', text: 'It speeds up browser rendering algorithms.' }
          ],
          correctOptionId: 'opt1',
          sourceQuote: 'Effortful retrieval creates a desirable difficulty that signals the hippocampus to consolidate memory traces permanently.',
          quoteLocation: 'Section 2: Cognitive Consolidation'
        }
      ]
    };

    startQuizEngine();
  }

  // 3. INTERACTIVE QUIZ ENGINE
  function startQuizEngine() {
    currentQIndex = 0;
    userAnswers = {};
    elapsedSeconds = 0;

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      timerBadge.textContent = `⏱️ ${formatTime(elapsedSeconds)}`;
    }, 1000);

    renderQuestion();
    switchState('quiz');
  }

  function renderQuestion() {
    if (!currentQuiz || !currentQuiz.questions[currentQIndex]) return;

    const q = currentQuiz.questions[currentQIndex];
    const total = currentQuiz.questions.length;

    qCounter.textContent = `Q ${currentQIndex + 1} OF ${total}`;
    quizProgressBar.style.width = `${((currentQIndex + 1) / total) * 100}%`;

    // Update score tally
    const currentAnswered = Object.keys(userAnswers).length;
    if (currentAnswered > 0) {
      const correctSoFar = currentQuiz.questions.reduce((acc, question) => {
        return userAnswers[question.id] === question.correctOptionId ? acc + 1 : acc;
      }, 0);
      const scorePct = Math.round((correctSoFar / currentAnswered) * 100);
      scoreTally.textContent = `SCORE: ${scorePct}%`;
    } else {
      scoreTally.textContent = 'SCORE: 0%';
    }

    questionPrompt.textContent = q.prompt;
    optionsContainer.innerHTML = '';
    quoteDrawer.classList.add('hidden');
    btnNextQ.classList.add('hidden');

    const keys = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, idx) => {
      const optBtn = document.createElement('button');
      optBtn.className = 'opt-btn';
      optBtn.innerHTML = `
        <span class="opt-key">${keys[idx] || (idx + 1)}</span>
        <span style="flex: 1;">${opt.text}</span>
      `;

      optBtn.addEventListener('click', () => handleOptionClick(q, opt.id));
      optionsContainer.appendChild(optBtn);
    });
  }

  function handleOptionClick(question, selectedOptId) {
    if (userAnswers[question.id]) return; // Already answered

    userAnswers[question.id] = selectedOptId;
    const isCorrect = selectedOptId === question.correctOptionId;

    const buttons = optionsContainer.querySelectorAll('.opt-btn');
    buttons.forEach((btn, idx) => {
      btn.classList.add('disabled');
      const option = question.options[idx];

      if (option.id === question.correctOptionId) {
        btn.classList.add('correct');
        btn.innerHTML += ` <span>✓</span>`;
      } else if (option.id === selectedOptId && !isCorrect) {
        btn.classList.add('incorrect');
        btn.innerHTML += ` <span>✗</span>`;
      }
    });

    // Show Source Quote Verification Drawer
    quoteLocation.textContent = question.quoteLocation || 'Source Context';
    sourceQuoteText.textContent = `"${question.sourceQuote}"`;
    quoteDrawer.classList.remove('hidden');

    // Show Next / Finish button
    if (currentQIndex === currentQuiz.questions.length - 1) {
      btnNextQ.querySelector('span').textContent = 'SEE FINAL RESULTS 🎉';
    } else {
      btnNextQ.querySelector('span').textContent = 'NEXT QUESTION →';
    }
    btnNextQ.classList.remove('hidden');
  }

  btnNextQ.addEventListener('click', () => {
    if (currentQIndex < currentQuiz.questions.length - 1) {
      currentQIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  });

  // 4. SUMMARY & SHARING SCREEN
  function finishQuiz() {
    if (timerInterval) clearInterval(timerInterval);

    const total = currentQuiz.questions.length;
    const correctCount = currentQuiz.questions.reduce((acc, q) => {
      return userAnswers[q.id] === q.correctOptionId ? acc + 1 : acc;
    }, 0);

    const scorePct = Math.round((correctCount / total) * 100);

    finalScorePct.textContent = `${scorePct}%`;
    finalScoreCount.textContent = `${correctCount}/${total} Correct`;
    finalTime.textContent = formatTime(elapsedSeconds);

    if (scorePct >= 80) {
      finalGradeTitle.textContent = '🎉 ACTIVE RECALL MASTER!';
    } else if (scorePct >= 50) {
      finalGradeTitle.textContent = '🧠 SOLID RETENTION!';
    } else {
      finalGradeTitle.textContent = '📚 KEEP RETRYING!';
    }

    shareFeedbackBanner.classList.add('hidden');
    switchState('summary');
  }

  btnRetake.addEventListener('click', () => {
    startQuizEngine();
  });

  btnShare.addEventListener('click', async () => {
    if (!currentQuiz) return;

    btnShare.querySelector('span').textContent = 'PUBLISHING...';

    try {
      const response = await fetch(`${API_BASE_URL}/api/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentQuiz)
      });

      const quizUrl = `${API_BASE_URL}/q/${currentQuiz.id}`;

      // Copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(quizUrl);
      }

      shareOnlineLink.href = quizUrl;
      shareFeedbackBanner.classList.remove('hidden');
      btnShare.querySelector('span').textContent = '✓ LINK COPIED!';

    } catch (err) {
      console.warn('Share API request offline, copying fallback URL:', err);
      const fallbackUrl = `${API_BASE_URL}/q/${currentQuiz.id}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(fallbackUrl);
      }
      shareOnlineLink.href = fallbackUrl;
      shareFeedbackBanner.classList.remove('hidden');
      btnShare.querySelector('span').textContent = '✓ LINK COPIED!';
    }
  });

  // HELPER FUNCTIONS
  function switchState(stateName) {
    statePreview.classList.add('hidden');
    stateGenerating.classList.add('hidden');
    stateQuiz.classList.add('hidden');
    stateSummary.classList.add('hidden');
    stateError.classList.add('hidden');

    if (stateName === 'preview') statePreview.classList.remove('hidden');
    if (stateName === 'generating') stateGenerating.classList.remove('hidden');
    if (stateName === 'quiz') stateQuiz.classList.remove('hidden');
    if (stateName === 'summary') stateSummary.classList.remove('hidden');
    if (stateName === 'error') stateError.classList.remove('hidden');
  }

  function showError(title, msg) {
    errorTitle.textContent = title;
    errorMessage.textContent = msg;
    switchState('error');
  }

  function formatTime(secs) {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  }
});
