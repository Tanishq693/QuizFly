// QuizFly Content Script - DOM Extractor & Context Script
(() => {
  if (window.__quizfly_content_script_injected) return;
  window.__quizfly_content_script_injected = true;

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'EXTRACT_PAGE_CONTENT') {
      try {
        const pageData = extractPageContext();
        sendResponse({ success: true, data: pageData });
      } catch (err) {
        console.error('[QuizFly] Failed extracting content:', err);
        sendResponse({ 
          success: false, 
          error: err.message || 'Failed extracting page text' 
        });
      }
      return true;
    }
  });

  function extractPageContext() {
    const title = document.title || 'Untitled Web Article';
    const url = window.location.href;
    const domain = window.location.hostname.replace(/^www\./, '');

    // Check highlighted text selection
    let selectedText = '';
    const selection = window.getSelection();
    if (selection) {
      selectedText = selection.toString().trim();
    }

    let extractedText = '';
    let isSelection = false;

    if (selectedText && selectedText.length > 100) {
      isSelection = true;
      extractedText = selectedText;
    } else {
      isSelection = false;
      extractedText = extractCleanBodyText();
    }

    // Truncate to safe 6,000 characters to ensure fast LLM turnarounds
    const safeText = extractedText.slice(0, 6000);
    const wordCount = safeText.split(/\s+/).filter(Boolean).length;

    return {
      title,
      url,
      domain,
      text: safeText,
      isSelection,
      wordCount
    };
  }

  function extractCleanBodyText() {
    // Clone body to manipulate without disturbing current page layout
    const clone = document.body.cloneNode(true);

    // Remove noise elements
    const noisySelectors = [
      'header', 'footer', 'nav', 'aside', 
      'script', 'style', 'noscript', 'iframe', 
      'svg', '.advertisement', '.ad', '.sidebar', '.comments'
    ];

    noisySelectors.forEach((selector) => {
      const elements = clone.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });

    // Try finding main article block first
    const articleBlock = clone.querySelector('article, main, [role="main"], .article-content, .post-content');
    let textContent = '';

    if (articleBlock) {
      textContent = articleBlock.innerText;
    } else {
      // Fallback to paragraph and heading text
      const paragraphs = Array.from(clone.querySelectorAll('h1, h2, h3, h4, p, li'))
        .map((el) => el.innerText.trim())
        .filter((txt) => txt.length > 20);

      textContent = paragraphs.join('\n\n');
    }

    if (!textContent || textContent.trim().length < 100) {
      textContent = clone.innerText || document.body.innerText || '';
    }

    // Clean whitespace
    return textContent
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
  }
})();
