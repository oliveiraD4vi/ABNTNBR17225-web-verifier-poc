/* VARIABLES AND DEFINITIONS */

const VERIFIER_ID = 'ABNTNBR17225';
const VERIFIER_NAME = 'ABNT NBR 17225 Web Verifier';
const TOOLTIP_ID = 'accessibility-tooltip-overlay';

const EVENTS = {
  RUN: 'RUN',
  HIGHLIGHT: 'HIGHLIGHT',
  RESET: 'RESET',
  OPEN_REPORT: 'OPEN_REPORT',
};

const SEVERITY = {
  WARNING: {
    name: 'WARNING',
    color: [255, 165, 0],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="#fff">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
    </svg>`,
  },
  ERROR: {
    name: 'ERROR',
    color: [255, 0, 0],
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="#fff">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/>
    </svg>`,
  },
  // INFO: {
  //   name: 'INFO',
  //   color: [0, 0, 255],
  //   icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="#fff">
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

  console.log(`Toggling node: ${id} - shouldShow: ${shouldShow}`);

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
