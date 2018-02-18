// Force the content script to be run everytime we navigate to a new page
// https://stackoverflow.com/a/21071357
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  chrome.tabs.executeScript(null, { file: 'content.js' })
})

