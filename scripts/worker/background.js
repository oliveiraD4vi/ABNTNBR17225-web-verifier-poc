chrome.runtime.onInstalled.addListener(() => {
  console.log("ABNT NBR 17225 WEB VERIFIER EXTENSION INSTALLED");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'OPEN_REPORT') {
    chrome.windows.create({
      url: chrome.runtime.getURL('../../report/report.html'),
      type: 'popup',
      width: 600,
      height: 800
    });
  }

  sendResponse({ status: 'OK' });
  return true;
});
