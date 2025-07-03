// RUN
const run = async () => {
  const {
    length,
    violationsPerId,
    violationsPerSeverity,
    warnings,
    errors,
  } = await runAccessibilityAudit();

  window.violationsCache = violationsPerSeverity;

  chrome.storage.local.set({
    accessibilityResults: {
      length,
      violations: violationsPerSeverity,
      violationsPerId,
      warnings,
      errors,
    }
  }, () => {
    console.log(`${VERIFIER_ID}: `, violationsPerSeverity, violationsPerId);
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
      warnings: 0,
      errors: 0,
      violations: [],
      violationsPerId: [],
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
