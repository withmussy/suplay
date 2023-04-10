/*global chrome*/
chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create(
    {
      url: chrome.runtime.getURL("main.html"),
      type: "popup",
      height: 500,
      width: 850,
    },
    (win) => {}
  );
});
