const error = [
  {
    id: 'img-alt',
    name: 'Imagem sem alt',
    description: 'Toda imagem deve possuir o atributo alt descritivo.',
    severity: SEVERITY.ERROR.name,
    check: () => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => !img.hasAttribute('alt') || img.getAttribute('alt').trim() === '')
        .map(img => ({
          element: img,
          message: 'Imagem sem atributo alt',
          snippet: img.outerHTML
        }));
    }
  },
  {
    id: 'html-lang',
    name: '<html> sem lang',
    description: 'A tag <html> deve possuir o atributo lang definido.',
    severity: SEVERITY.ERROR.name,
    check: () => {
      const html = document.querySelector('html');
      if (!html.hasAttribute('lang')) {
        return [{
          element: html,
          message: 'A tag <html> está sem o atributo lang',
          snippet: html.outerHTML
        }];
      }
      return [];
    }
  },
];

const warning = [
  {
    id: 'contrast-check',
    name: 'Baixo contraste',
    description: 'Verifica se o contraste entre texto e fundo atende ao mínimo (4.5:1).',
    severity: SEVERITY.ERROR.name,
    check: () => {
      const visited = new Set();
      const results = [];

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const style = getComputedStyle(parent);

          const rect = parent.getBoundingClientRect();
          if (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            parseFloat(style.opacity) === 0 ||
            // parent.offsetParent === null ||
            // rect.bottom < 0 || rect.top > window.innerHeight ||
            parent.hasAttribute('aria-hidden') ||
            parent.getAttribute('tabindex') === '-1'
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      });

      let node;
      while ((node = walker.nextNode())) {
        const parent = node.parentElement;
        if (visited.has(parent)) continue;

        const style = getComputedStyle(parent);
        const fgMatch = style.color.match(/rgba?\((\d+), (\d+), (\d+)/);
        if (!fgMatch) continue;

        const fgHex = '#' + [1, 2, 3].map(i => (+fgMatch[i]).toString(16).padStart(2, '0')).join('');
        const bgHex = getEffectiveBackgroundColor(parent);
        const contrast = getContrast(fgHex, bgHex);

        if (contrast > 0 && contrast < 4.5) {
          visited.add(parent);
          results.push({
            id: 'contrast-check',
            name: 'Baixo contraste',
            description: 'Verifica se o contraste entre texto e fundo atende ao mínimo (4.5:1).',
            severity: 'error',
            message: 'Contraste abaixo do recomendado (mínimo 4.5:1)',
            snippet: parent.outerHTML
          });
        }
      }

      return results;
    }
  },
  {
    id: 'input-label',
    name: 'Input sem label',
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

const info = [
  {
    id: 'heading-h1',
    name: 'Ausência de <h1>',
    description: 'Toda página deve conter pelo menos um <h1>.',
    severity: SEVERITY.INFO.name,
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

const accessibilityRules = [
  ...error,
  ...warning,
  ...info,
];
