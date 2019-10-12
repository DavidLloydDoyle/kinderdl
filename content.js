// content.js

var numberOfImages = 0;

//
var observer = new MutationObserver(function () {
  changeDetected();
});

function changeDetected(){
  console.log("Change detected");
  var latestNumberOfImages = $(".photo-container a img").length;
  if(numberOfImages != latestNumberOfImages){
	numberOfImages = latestNumberOfImages;
    loadMore();
  }
}

function checkImages(){
  numberOfImages = $(".photo-container a img").length;
  console.log(numberOfImages);
}

function loadMore(){
  console.log("Load More");
      //Get the page to load more images
      // Need to add a loop.
      // Should do a check agaisnt a stoed date setting to only go back as far as i needed
      // Hack
      // Should be a better way to do this...
      location.href="javascript:$('#posts').infinitescroll('retrieve'); void 0";
}

function downloadImages(){
  console.log("Download Images");
        //for all photos
      $(".photo-container a img").each(function(index, element){
        var imgUrl = $(element).parent().attr('href'); 
        // send message to background.js to download the image
        // need to add logic to 
        //  sort/name the file
        //  fill out the ??
        //  just download ones of your kids/room 
        chrome.runtime.sendMessage({"message": "download", "url": imgUrl});
		return index < 1; //only run 1 times for testing
      });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {

	  downloadImages();

      checkImages();
 
	  loadMore();

      //Check for page chnages
      observer.observe(document.getElementById('posts'), {attributes: true, childList: true, characterData: true});

      // This line is new!
      //chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
    }
  }
);


//$('#posts').infinitescroll('retrieve');


//$('div.post').last().find('.post-content .post-header div.sent').each(function(){
//var datestring = $(this).text().trim().split(" ");
//console.log(datestring[4] + "-" + datestring[3]);
//})

/*
$('#posts').infinitescroll({'retrieve',
// callback
}, function( items ) {
  console.log("loaded");
});
*/








/*


 var observer = new MutationObserver(function () {
   reserve();
 });
 observer.observe(document.documentElement, {attributes: true, childList: true, characterData: true});

function reserve(){
  let Shifts = document.getElementsByName("shifts");
  if (Shifts.length !== 0) {
    for (let i = 0; i < Shifts.length; i++) {
      Shifts[i].click();
      break;
    }
    document.querySelector("#Btn").click();
  }
}

*/

