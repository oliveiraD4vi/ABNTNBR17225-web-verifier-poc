/* HEADINGS RULES FILE */

const headingRules = [
  {
    id: 'heading-h1',
    name: 'Ausência de <h1>',
    description: 'Toda página deve conter pelo menos um <h1>.',
    severity: SEVERITY.WARNING.name,
    check: () => {
      if (document.querySelectorAll('h1').length === 0) {
        return [{
          element: document.body,
          message: 'Nenhum <h1> encontrado na página',
          snippet: '<body>'
        }];
      }
      return [];
    }
  },
];
