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
    const container = document.getElementById('accessibility-report');

    if (!container) return;

    chrome.storage.local.get('accessibilityResults', (data) => {
      const length = data.accessibilityResults?.length || 0;
      const warnings = data.accessibilityResults?.warnings || 0;
      const errors = data.accessibilityResults?.errors || 0;
      const verifications = data.accessibilityResults?.violations || [];

      if (!length || counter < 1) {
        setTimeout(() => populateData(counter + 1), 100);
        return;
      }

      toggleLoading();

      if (hasBeenClicked('highlight')) {
        sendEvent(EVENTS.HIGHLIGHT);
      };

      const content = container.querySelector('.accessibility-report--content');

      if (!content) return;

      content.innerHTML = `
        <h2>Sumário</h2>
        <p>Violações às regras avaliadas: <strong>${length}</strong></p>
        <p class="violations error">Requisitos: <strong>${errors}</strong></p>
        <p class="violations warning">Recomendações: <strong>${warnings}</strong></p>

        <div class="accessibility-report--content-violations">
          <h3>Violações</h3>
          <i>Violações serão listadas abaixo...</i>
        </div>
      `;

      // TO-DO
      // RENDER ALL VIOLATIONS BY RULE_TYPE
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

  function toggleLoading() {
    toggleNode('loading');

    const loading = document.getElementById('loading');

    if (!loading) return;

    if (getComputedStyle(loading).display === 'none') {
      toggleNode('buttons', true);
      toggleNode('highlight', true);
      toggleNode('export', true);
      toggleNode('report', true);
      toggleNode('accessibility-report', true);
    } else {
      toggleNode('buttons', false);
      toggleNode('accessibility-report', false);
    }
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
