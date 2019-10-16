// content.js

// Var to count the current number of images on the page
var numberOfImages = 0;

// Var to observe changes to the DOM
var observer = new MutationObserver(function () {
  changeDetected();
});

// Function run on DOM changes obseved
// Get the current number of images in the changes DOM
// If there are more than last time, update the tracker then try and load more again
// Otherwise do nothing as there are no more images
function changeDetected(){
  var latestNumberOfImages = $(".photo-container a img").length;
  if(numberOfImages != latestNumberOfImages){
	numberOfImages = latestNumberOfImages;
    loadMore();
  }
}

// Function to check th number to images
function checkImages(){
  numberOfImages = $(".photo-container a img").length;
}

// Function to load more images by 'clicking' on the load more button
// The clicking is done by injecting javascript through a redirect which is then stopped
function loadMore(){
  // Get the page to load more images
  // Should do a check agaisnt a stored date setting to only go back as far as i needed
  // This is a hack - should be a better way to do this...
  location.href="javascript:$('#posts').infinitescroll('retrieve'); void 0";
}

// Function to send message to background JS witha URL or an image to download
function downloadImages(){
  // Loop through all images (photos)
  $(".photo-container a img").each(function(index, element){
    var imgUrl = $(element).parent().attr('href'); 
    // Send message to background.js to download the image
    // Need to add logic to:
      // Sort/name the file, etc
      // Options to just download ones of your kids/room, sent directly to your kid, including commentary
    chrome.runtime.sendMessage({"message": "download", "url": imgUrl});
    return index < 1; //DEBUG: only run 1 times for testing
  });
}

// Function to scrape the DOM and store each posts data into an array
function scrapePosts(){
  var posts = new Array(); // Used to store the post data
  var imageData = new Array(); // Used to store the image URLs

  // Go through every post
  $(".post .post-content").each(function(index, element){
    // Start a new array for each post
    posts[index] = new Array();
    
    //Get the 'room' name from the post
    posts[index]['room'] = $(element).find('.post-header .author strong').text()
    
    //Get who (which kids, etc) the images were sent 'to'
    posts[index]['to'] = new Array();
    $(element).find('.post-header .author .targets li').not('.target-summary').each(function(index2, element2){
      posts[index]['to'][index2] = $(element2).text();
    })
    
    //Get the urls of each image in the post
    posts[index]['images'] = new Array();
    $(element).find('.photo-container a img').each(function(index2, element2){
      posts[index]['images'][index2] = $(element2).parent().attr('href'); 
    })

    //Get and transform the post date/time
    var datestring = $(element).find('.post-header div.sent').text().trim().split(" ");
    if(datestring[5] == 'at'){
      //Index 5 = 'at' when the post is from this year, because it doesn't have the year in the string, so we add it in.
      datestring[5] = (new Date).getFullYear();
    }
    else
    {
      //If it's from a previous year, add the first two digits ('20'), then replace the 'at' with the time, and the time with AM/PM
      datestring[5] = "20" + datestring[5];
      datestring[6] = datestring[7];
      datestring[7] = datestring[8];
    }

    // Turn mmm into mm
    var months = ['0', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var month = months.indexOf(datestring[4]);
    if(month < 10){
      month = "0" + month;
    }
    datestring[4] = month;

    // Turn d into dd
    if(datestring[3] < 10){
      datestring[3] = "0" + datestring[3];
    }
   
    //Split the time, to make it 24 hours time, if it's PM, turn it to an INT and add 12, else turn h into hh
    var ampm = datestring[6].split(":");
    if(datestring[7].trim() == "PM" && parseInt(ampm[0]) != 12){
      datestring[6] = (parseInt(ampm[0]) + 12).toString() + ":" + ampm[1];
    }
    else if(parseInt(ampm[0]) < 10){
      datestring[6] = "0" + datestring[6];
    }

    //Set the date
    ampm = datestring[6].split(":");
    posts[index]['date'] = datestring[5] + datestring[4] + datestring[3] + ampm[0] + ampm[1];

    //Get the post commentary
    $(element).find('.message').find( "*" ).each(function( index ) {
      $( this ).append('x');
    });
    posts[index]['message'] = $(element).find('.message').text();

    // Liklihood index
    posts[index]['ben'] = 0.3;
    
    // If post is sent to "Benjamin Doyle" 
    if(posts[index]['to'].indexOf("Benjamin Doyle") != -1){
      // If the post is sent to more then one person
      if(posts[index]['to'].length > 1){
	// If the message includes "Ben", set liklihood to 0.8
        if(posts[index]['message'].indexOf("Ben") != -1){
          posts[index]['ben'] = 0.8;
        }
        else{
	  // Else set to 0.5
          posts[index]['ben'] = 0.5;        
        }
      } 
      else if(posts[index]['to'].length == 1){
	// f only send to Ben, set to 1.0
        posts[index]['ben'] = 1;
      } 
    }

    // If sent to multiple rooms, then set to 0 
    if(posts[index]['to'] == "Pioneers,Mini-Explorers,Explorers,Seekers"){
      posts[index]['ben'] = 0;
    }
	  
    // If sent to "Discover My World Engadine", then set to 0 	  
    if(posts[index]['to'] == "Discover My World Engadine"){
      posts[index]['ben'] = 0;
    }
	  
    // If there is no image, then set to 0	  
    if(posts[index]['images'].length == 0){
      posts[index]['ben'] = 0;
    }
  })
}

// Add listener to handle messages recieved
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      downloadImages(); // Send message to background.js to download imaegs
      checkImages(); // Check and store the number of images on a page
      loadMore(); // Load more images on the page

      //Check for page changes
      observer.observe(document.getElementById('posts'), {attributes: true, childList: true, characterData: true});

      //DUBUG: This can be used to send a message to background.js to open a new tab
      //chrome.runtime.sendMessage({"message": "open_new_tab", "url": firstHref});
    }
  }
);
