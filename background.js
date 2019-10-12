// background.js
// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) 
{
    if(typeof tab != "undefined" && typeof tab != "null" )
    {
        // If the tabs URL contains "specificsite.com"...
        if(tab.url.indexOf('http://app.kinderloop.com') == 0)
        {
            // ... show the page action.
            console.log(tab.url);
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

// This block is new!
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "open_new_tab" ) {
      chrome.tabs.create({"url": request.url});
    }

    if( request.message === "download" ) {
      chrome.downloads.download({url: request.url});
    }
  }
);


//MVP1
//load page/images until date/X
  //find images
  //dl images

//MVP2
//has this run before? if so get date? otherwise go until no more pages?? or X
//store latest date, so next time doesnt overlap.

//MVP3
//remove duplicates 
//sort images (date/room/posttype etc)
//add date to meta data??

//MVP4
//capture persoanl posts just to ben or from X or Y

//MVP5
//Use comments as descriptons in meta data?
