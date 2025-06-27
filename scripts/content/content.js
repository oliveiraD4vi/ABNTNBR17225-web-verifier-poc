// RUN
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

// HIGHLIGHT
const highlightEvent = () => {
  const action = () => {
    if (!window.violationsCache) {
      setTimeout(() => action(), 1000);
      return;
    }

    highlightIssuesBySeverity(window.violationsCache);
  };

  action();
}
