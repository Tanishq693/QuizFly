// QuizFly Service Worker - Context Menu & Background Controller
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'quizfly-selection-quiz',
    title: '⚡ Generate Quiz from Selection',
    contexts: ['selection']
  });

  console.log('[QuizFly Background] Context menu registered: quizfly-selection-quiz');
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'quizfly-selection-quiz' && info.selectionText) {
    let domain = 'web-source';
    try {
      if (tab && tab.url) {
        domain = new URL(tab.url).hostname.replace(/^www\./, '');
      }
    } catch (e) {
      domain = 'web-source';
    }

    const pendingData = {
      text: info.selectionText.trim(),
      url: tab ? tab.url : '',
      title: tab ? tab.title : 'Highlighted Text Selection',
      domain: domain,
      isSelection: true,
      wordCount: info.selectionText.trim().split(/\s+/).length,
      timestamp: Date.now()
    };

    chrome.storage.local.set({ quizfly_pending_selection: pendingData }, () => {
      console.log('[QuizFly Background] Saved pending selection to storage:', pendingData);
    });
  }
});
