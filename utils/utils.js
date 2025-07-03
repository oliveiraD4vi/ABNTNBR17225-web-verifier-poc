/* VARIABLES AND DEFINITIONS */

const VERIFIER_ID = 'ABNTNBR17225';
const VERIFIER_NAME = 'ABNT NBR 17225 Web Verifier';
const TOOLTIP_ID = 'accessibility-tooltip-overlay';

const RULE_TYPES = {
  FORM: 'FORM',
  LIST: 'LIST',
  TEXT: 'TEXT',
  TIME: 'TIME',
  COLOR: 'COLOR',
  MEDIA: 'MEDIA',
  TABLE: 'TABLE',
  REGION: 'REGION',
  CODING: 'CODING',
  HEADING: 'HEADING',
  ANIMATION: 'ANIMATION',
  NAVIGATION: 'NAVIGATION',
  PRESENTATION: 'PRESENTATION',
  BUTTON_AND_CONTROL: 'BUTTON_AND_CONTROL',
  KEYBOARD_INTERACTION: 'KEYBOARD_INTERACTION',
};

const EVENTS = {
  RUN: 'RUN',
  HIGHLIGHT: 'HIGHLIGHT',
  RESET: 'RESET',
  OPEN_REPORT: 'OPEN_REPORT',
};

const SEVERITY = {
  WARNING: {
    name: 'WARNING',
    color: '#fdb147',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="#fff">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
    </svg>`,
  },
  ERROR: {
    name: 'ERROR',
    color: '#f73e37',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="#fff">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
    </svg>`,
  },
  // INFO: {
  //   name: 'INFO',
  //   color: '',
  //   icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24" fill="#fff">
  //     <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/>
  //   </svg>`,
  // }
};

/* HTML HANDLING FUNCTIONS */

// FUNCTION TO WAIT FOR AN ELEMENT BEFORE DOING SOMETHING
// USE TOGETHER WITH async/await or .then
function waitForElem(selector, root) {
  return new Promise((resolve) => {
    if (root.querySelector(selector)) {
      return resolve(root.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (root.querySelector(selector)) {
        observer.disconnect();
        resolve(root.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// OBSERVE UNTIL A GIVEN ELEMENT IS DESTROYED OR REMOVED
// FROM A GIVEN NODE AND CALLS A GIVEN FUNCTION AFTER IT HAPPENS
function observeRemoval(element, node, fn) {
  try {
    if (!element || !node || !fn) return;

    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && !node.contains(element)) {
          fn();

          observer.disconnect();
          break;
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  } catch (error) {
    console.error(error);
  }
}

function toggleNode(id, shouldShow = null) {
  const node = document.getElementById(id);

  if (!node) return;

  if (shouldShow == true || (shouldShow == null && node.classList.contains('d-none'))) {
    node.classList.remove('d-none');
  } else if (shouldShow == false || (shouldShow == null && !node.classList.contains('d-none'))) {
    node.classList.add('d-none');
  }
}

function removeNode(node, id = null) {
  if (id) {
    node = document.getElementById(id);
  }

  if (!node) return;

  node.remove();
}

/* CALCULUS */

function generateCustomId(append = '') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const getRandomChar = () => chars.charAt(Math.floor(Math.random() * chars.length));

  let result = '';
  for (let i = 0; i < 24; i++) {
    result += getRandomChar();
  }

  // Format as 'CCCC-CCCCCCCCCC-CC...'
  const formatted = `${result.slice(0, 4)}-${result.slice(4, 14)}-${result.slice(14, 24)}`;

  return `${append || VERIFIER_ID.toLowerCase()}-${formatted}`;
}

/* REPORT DATA */

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function toggleLoading() {
  toggleNode('loading');

  const loading = document.getElementById('loading');

  if (!loading) return;

  if (getComputedStyle(loading).display === 'none') {
    toggleNode('buttons', true);
    toggleNode('highlight', true);
    toggleNode('export', true);
    toggleNode('report', true);
    toggleNode('accessibility-report', true);
  } else {
    toggleNode('buttons', false);
    toggleNode('accessibility-report', false);
  }
}

function hasBeenClicked(id) {
  const button = document.getElementById(id);
  return button && button.hasBeenClicked;
}

function populateData(isReport = false, counter = 0) {
  const container = document.getElementById('accessibility-report');

  if (!container) return;

  chrome.storage.local.get('accessibilityResults', (data) => {
    const length = data.accessibilityResults?.length || 0;
    const warnings = data.accessibilityResults?.warnings || 0;
    const errors = data.accessibilityResults?.errors || 0;
    const violationsPerId = data.accessibilityResults?.violationsPerId || {};

    if (!length || counter < 1) {
      setTimeout(() => populateData(isReport, counter + 1), 100);
      return;
    }

    toggleLoading();

    if (hasBeenClicked('highlight')) {
      sendEvent(EVENTS.HIGHLIGHT);
    };

    const content = container.querySelector('.accessibility-report--content');

    if (!content) return;

    content.innerHTML = getHTMLForViolations(violationsPerId, length, warnings, errors, isReport);
  });
}

function getHTMLForViolations(violationsPerId = {}, length = 0, warnings = 0, errors = 0, isReport = false) {
  return `
    <h2>Sumário</h2>
    <p>Violações às regras avaliadas: <strong>${length}</strong></p>
    <p>Compostas de:</p>
    
    <div class="accessibility-report--content-summary">
      <p class="violations error"><strong>${errors} ${errors > 1 ? `Requisitos` : `Requisito`}</strong></p>
      <p class="violations warning"><strong>${warnings} ${warnings > 1 ? `Recomendações` : `Recomendação`}</strong></p>
    </div>

    <div class="accessibility-report--content-violations">
      <h3>Violações</h3>

      ${
        // TO-DO
        // RENDER PER RULE TYPE

        Object.keys(violationsPerId).map(type => {
          const violations = violationsPerId[type];

          if (!violations || !violations.length) return '';

          const violation = violations[0];

          return `
            <div class="violation-type ${violation.severity}">
              <h4>${violation.name}</h4>
              <p class="violation-item">Ocorrências: ${violations.length}</p>
              ${isReport ?
                `
                  <p>${violation.description}</p>
                  <p class="violation-message">${violation.message}</p>
                  <ul class="violations-list">
                    ${violations.map(violation => `
                      <li class="violation-item">
                        <pre class="violation-snippet">${escapeHtml(violation.snippet?.toString() || '')}</pre>
                      </li>  
                    `).join('')}
                  </ul>
                ` : ''
              }
            </div>
          `;
        }).join('')
      }
    </div>
  `;
}
