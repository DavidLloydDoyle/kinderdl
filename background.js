// background.js
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) 
{
    if(typeof tab != "undefined" && typeof tab != "null" )
    {
        // If the tabs URL contains a specific string. eg. Only enable the extension on those pages.
        if(tab.url.indexOf('http://app.kinderloop.com') == 0)
        {
            chrome.pageAction.show(tabId);
        }
    }
};

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

// Called when the user clicks on the browser action.
chrome.pageAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

// An event listener to execute actions if background.js gets messaegs sent to it
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Open a new tab with the the URL sent in the message
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": request.url});
    }

    // Download the file from the URL sent in the message
    if( request.message === "download" ) {
      chrome.downloads.download({url: request.url});
    }
  }
);
