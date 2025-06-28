chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('RECEIVED REQUEST:', request.action);

  switch (request.action) {
    case EVENTS.RUN:
      run();
      break;
    case EVENTS.HIGHLIGHT:
      highlightEvent();
      break;
    case EVENTS.RESET:
      resetEvent();
      break;
    default:
      break;
  }

  sendResponse({ status: 'OK' });
  return true;
});
