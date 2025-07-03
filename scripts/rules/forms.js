/* FORMS RULES FILE */

const formRules = [
  {
    id: 'input-label',
    name: 'Input sem label',
    type: RULE_TYPES.FORM,
    description: 'Todo input deve estar associado a um label visível.',
    severity: SEVERITY.WARNING.name,
    check: () => {
      return Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"])'))
        .filter(input => {
          const id = input.id;
          return !input.closest('label') && !(id && document.querySelector(`label[for="${id}"]`));
        })
        .map(input => ({
          element: input,
          message: 'Input sem label associado',
          snippet: input.outerHTML
        }));
    }
  },
  {
    id: 'button-name',
    name: 'Botões sem nome acessível',
    type: RULE_TYPES.FORM,
    description: 'Botões devem ter texto visível ou atributo aria-label.',
    severity: SEVERITY.WARNING.name,
    check: () => {
      return Array.from(document.querySelectorAll('button'))
        .filter(btn =>
          !btn.textContent.trim() &&
          !btn.getAttribute('aria-label')
        )
        .map(btn => ({
          element: btn,
          message: 'Botão sem nome acessível',
          snippet: btn.outerHTML
        }));
    }
  },
];
