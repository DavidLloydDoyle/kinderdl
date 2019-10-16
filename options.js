// Mainly here for an example at this stage
// Nothing is done with the options other than saved/retrieve

// Saves options to chrome.storage
function save_options() {
  //Get the value of the options from the form elements
  var color = document.getElementById('color').value;
  var likesColor = document.getElementById('like').checked;
  
  //Use the Chrome Storage API to save the values
  chrome.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items) {
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('like').checked = items.likesColor;
  });
}

//Set event listener to restore the options once the DOM is loaded 
document.addEventListener('DOMContentLoaded', restore_options);

//Set event listener to save the form values once the save button is clicked 
document.getElementById('save').addEventListener('click', save_options);
