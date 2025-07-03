async function runAccessibilityAudit(customRules = []) {
  const allRules = [...accessibilityRules, ...customRules];
  const results = [];

  for (const rule of allRules) {
    try {
      const violations = await rule.check();
      violations.forEach(v => {
        results.push({
          id: rule.id,
          name: rule.name,
          description: rule.description,
          severity: rule.severity,
          message: v.message,
          snippet: v.snippet,
          customId: generateCustomId(rule.id)
        });
      });
    } catch (err) {
      console.error(`Erro na regra ${rule.id}:`, err);
    }
  }

  function organize(arr, propertyName = 'severity') {
    if (!Array.isArray(arr) || !arr.length) {
      return {};
    }

    return arr.reduce((acc, item) => {
      const property = item[propertyName];

      if (!acc[property]) {
        acc[property] = [];
      }

      acc[property].push(item);
      return acc;
    }, {});
  }

  const violationsPerSeverity = organize(results);
  const violationsPerId = organize(results, 'id');

  return {
    length: results.length,
    errors: (violationsPerSeverity[SEVERITY.ERROR.name] || []).length,
    warnings: (violationsPerSeverity[SEVERITY.WARNING.name] || []).length,
    violationsPerId,
    violationsPerSeverity,
  };
}
