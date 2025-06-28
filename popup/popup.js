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

  function populateData(counter = 0) {
    const container = document.getElementById('accessiblity-report');

    if (!container) return;

    chrome.storage.local.get('accessibilityResults', (data) => {
      const length = data.accessibilityResults?.length || 0;
      const verifications = data.accessibilityResults?.violations || [];

      if (!length || counter < 1) {
        setTimeout(() => populateData(counter + 1), 100);
        return;
      }

      toggleNode('accessiblity-report', true);

      if (hasBeenClicked('highlight')) {
        sendEvent(EVENTS.HIGHLIGHT);
      };

      const content = container.querySelector('.accessiblity-report--content');

      if (!content) return;

      content.innerHTML = '<p>Violações às regras avaliadas: ' + length + '</p>';

      // TO-DO
      // ADD VERIFICATIONS TEMPLATE AND CODE
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

  function hasBeenClicked(id) {
    const button = document.getElementById(id);
    return button && button.hasBeenClicked;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const start = () => {
      sendEvent(EVENTS.RUN);
      populateData();
    }

    // FIRST RUN BUTTON LISTENER
    listenButtonClick('run', () => {
      start();

      // HANDLE OTHER BUTTONS AFTER FIRST RUN
      toggleNode('highlight', true);
      toggleNode('export', true);
      toggleNode('report', true);
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
        filename: 'accessiblity-report.json'
      });
    });
    listenButtonClick('highlight', () => {
      sendEvent(EVENTS.HIGHLIGHT);
    });
  });
})();
