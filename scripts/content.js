(async function () {
  runAccessibilityAudit().then(({ length, violations }) => {
    chrome.storage.local.set({
      accessibilityResults: {
        length,
        violations
      }
    }, () => {
      console.log(`${VERIFIER_ID}: `, violations);
    });
  });
})();
