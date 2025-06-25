(function() {
  function listenExport(counter = 0) {
    const exportBtn = document.getElementById('export');

    chrome.storage.local.get('accessibilityResults', (data) => {
      const length = data.accessibilityResults?.length || 0;
      const verifications = data.accessibilityResults?.violations || [];

      if (!length) {
        exportBtn.classList.add('d-none');
        setTimeout(() => listenExport(counter + 1), 1000);
        return;
      }

      exportBtn.classList.remove('d-none');
      exportBtn.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(verifications, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({
          url: url,
          filename: 'accessiblity-report.json'
        });
      });
    });
  }

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

  document.addEventListener('DOMContentLoaded', () => {
    populateData();
    listenExport();
  });
})();
