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

// RESET EVENT
const resetEvent = () => {
  reset();

  if (window.violationsCache?.length) {
    window.violationsCache.forEach(issue => removeHighlight(issue));
  }

  window.violationsCache = [];

  chrome.storage.local.set({
    accessibilityResults: {
      length: 0,
      violations: []
    }
  }, () => {
    console.log(`${VERIFIER_ID}: RESET COMPLETED`);
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
