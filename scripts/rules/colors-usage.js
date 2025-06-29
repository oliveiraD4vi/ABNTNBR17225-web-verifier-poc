/* COLORS RULES FILE */

const getContrast = (hex1, hex2) => {
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };
  const luminance = (r, g, b) => {
    const toLinear = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const lum1 = luminance(r1, g1, b1);
  const lum2 = luminance(r2, g2, b2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
};

const getEffectiveBackgroundColor = (el) => {
  while (el) {
    const style = getComputedStyle(el);
    const bg = style.backgroundColor;
    const match = bg.match(/rgba?\((\d+), (\d+), (\d+)/);
    if (match && style.opacity !== '0' && style.display !== 'none') {
      const [r, g, b] = [match[1], match[2], match[3]];
      if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return '#' + [r, g, b].map(x => (+x).toString(16).padStart(2, '0')).join('');
      }
    }
    el = el.parentElement;
  }
  return '#ffffff';
};

const colorsRules = [
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
            parent.offsetParent === null ||
            rect.bottom < 0 || rect.top > window.innerHeight ||
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
];
