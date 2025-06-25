const run = async () => {
  const { length, violations } = await runAccessibilityAudit();

  window.violationsCache = violations;

  chrome.storage.local.set({
    accessibilityResults: {
      length,
      violations
    }
  }, () => {
    console.log(`${VERIFIER_ID}: `, violations);
  });
};

(async function () {
  await run();
})();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'RERUN') {
    run();
  } else if (request.action === 'HIGHLIGHT') {
    const action = () => {
      if (!window.violationsCache) {
        sendResponse({ status: 'NO VALIDATIONS' });
        setTimeout(() => action(), 1000);
        return;
      }

      highlightIssuesBySeverity(window.violationsCache);
    };

    action();

    sendResponse({ status: 'OK' });
    return true;
  }
});
