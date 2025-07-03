/* IMAGES, AUDIO AND VIDEO RULES FILE */

const mediaRules = [
  {
    id: 'img-alt',
    name: 'Imagem sem alt',
    type: RULE_TYPES.MEDIA,
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
    type: RULE_TYPES.MEDIA,
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
