chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.info('RECEIVED REQUEST:', request.action);

  switch (request.action) {
    case EVENTS.RUN:
      run();
      break;
    case EVENTS.HIGHLIGHT:
      highlightEvent();
      break;
    default:
      break;
  }

  sendResponse({ status: 'OK' });
  return true;
});
