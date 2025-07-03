(function() {
  function sendEvent(event) {
    if (!event) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: event
      });
    });
  }

  function sendMessage(message) {
    if (!message) return;

    chrome.runtime.sendMessage({
      action: message
    });
  }

  function listenButtonClick(id, fn, forceListener = false, counter = 0) {
    const button = document.getElementById(id);

    if (!button) return;

    chrome.storage.local.get('accessibilityResults', (data) => {
      const length = data.accessibilityResults?.length || 0;

      if (!length && !forceListener) {
        setTimeout(() => listenButtonClick(id, fn, counter + 1), 1000);
        return;
      }

      const custom = () => {
        fn(data.accessibilityResults);
        button.hasBeenClicked = true;
      }

      button.removeEventListener('click', custom);
      button.addEventListener('click', custom);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const start = () => {
      toggleLoading();
      sendEvent(EVENTS.RUN);
      setTimeout(() => populateData(), 1000);
    }

    // FIRST RUN BUTTON LISTENER
    listenButtonClick('run', () => {
      start();

      // REMOVE BUTTON AFTER FIRST RUN
      removeNode(null, 'run');
    }, true);

    // OTHER BUTTONS LISTENERS
    listenButtonClick('report', () => {
      sendMessage(EVENTS.OPEN_REPORT);
    });
    listenButtonClick('rerun', () => {
      sendEvent(EVENTS.RESET);
      start();
    });
    listenButtonClick('close', () => {
      sendEvent(EVENTS.RESET);
      window.close();
    });
    listenButtonClick('export', ({ violations: verifications }) => {
      const blob = new Blob([JSON.stringify(verifications, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: 'accessibility-report.json'
      });
    });
    listenButtonClick('highlight', () => {
      sendEvent(EVENTS.HIGHLIGHT);
    });
  });
})();
