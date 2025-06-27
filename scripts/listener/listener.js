chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Received request:', request.action);

  switch (request.action) {
    case EVENTS.RERUN:
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
