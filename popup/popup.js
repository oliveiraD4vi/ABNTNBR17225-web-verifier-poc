(function() {
  function populateData(counter = 0) {
    const container = document.getElementById('accessiblity-report');

    chrome.storage.local.get('accessibilityResults', (data) => {
      const length = data.accessibilityResults?.length || 0;
      const verifications = data.accessibilityResults?.violations || [];

      if (!length) {
        setTimeout(() => populateData(counter + 1), 1000);
        return;
      }

      container.innerHTML = '<p>Violações às regras avaliadas: ' + length + '</p>';

      // TO-DO
      // ADD VERIFICATIONS TEMPLATE AND CODE
    });
  }

  function send(event) {
    if (!event) return;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: event
      });
    });
  }

  function toggleNode(id, shouldShow = null) {
    const node = document.getElementById(id);

    if (!node) return;

    if (shouldShow == true || (shouldShow == null && node.classList.contains('d-none'))) {
      node.classList.remove('d-none');
    } else if (shouldShow == false || (shouldShow == null && !node.classList.contains('d-none'))) {
      node.classList.add('d-none');
    }
  }

  function listenButtonClick(id, fn, counter = 0) {
    const button = document.getElementById(id);

    if (!button) return;

    chrome.storage.local.get('accessibilityResults', (data) => {
      const length = data.accessibilityResults?.length || 0;

      if (!length) {
        setTimeout(() => listenButtonClick(id, fn, counter + 1), 1000);
        return;
      }

      const custom = () => fn(data.accessibilityResults);

      button.removeEventListener('click', custom);
      button.addEventListener('click', custom);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // START BUTTON LISTENER
    listenButtonClick('run', () => {
      // START ACTION
      send(EVENTS.RUN);
      populateData();

      // SHOW OTHER BUTTONS
      toggleNode('highlight', true);
      toggleNode('export', true);
    });

    // OTHER BUTTONS LISTENERS
    listenButtonClick('highlight', () => {
      send(EVENTS.HIGHLIGHT);
    });
    listenButtonClick('export', ({ violations: verifications }) => {
      const blob = new Blob([JSON.stringify(verifications, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      chrome.downloads.download({
        url: url,
        filename: 'accessiblity-report.json'
      });
    });
  });
})();
