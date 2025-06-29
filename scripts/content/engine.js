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

  function organize(arr) {
    return arr.reduce((acc, item) => {
      const severity = item.severity;

      if (!acc[severity]) {
        acc[severity] = [];
      }

      acc[severity].push(item);
      return acc;
    }, {});
  }

  const violations = organize(results);

  return {
    length: results.length,
    errors: (violations[SEVERITY.ERROR.name] || []).length,
    warnings: (violations[SEVERITY.WARNING.name] || []).length,
    violations,
  };
}
