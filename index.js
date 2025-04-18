/**
 * Executes a callback function once the DOM is fully loaded and the body element is available.
 *
 * This function repeatedly checks for the presence of the body element in the DOM and,
 * upon finding it, clears the interval and executes the provided callback function.
 *
 * @param {Function} callback - The function to execute once the body element is available.
 */
function onReady(callback) {
  var intervalId = window.setInterval(function() {
    if (document.getElementsByTagName('body')[0] !== undefined) {
      window.clearInterval(intervalId);
      callback.call(this);
    }
  }, 1000);
}
  

function setVisible(selector, visible) {
  const elem = document.querySelector(selector);

  elem.style.transition = 'opacity 0.3s ease-in-out';
  elem.style.opacity = visible ? '1' : '0';
  setTimeout(() => elem.style.display = visible ? 'block' : 'none', visible ? 0 : 300);
}

// fullscreen picture function

/**
 * Creates a full screen image and appends it to the body.
 * The image will be removable by clicking the close button.
 * 
 * @param {string} imageSrc - The source URL of the image to be displayed.
 */
function clickToFullScreen(imageSrc) {

  // Check if the image exists. If it does not, return without doing anything.
  var image = new Image();
  image.src = imageSrc;

  /**
   * Checks if the image is loaded.
   * If it is, it creates a div with the class 'fullscreen' to hold the full screen image and the close button.
   * It also adds an event listener to the close button that removes the full screen image from the page when clicked.
   * 
   * @returns {void}
   */
  $(image).on('load', () => {

    // Create a div with the class 'fullscreen' to hold the full screen image and the close button.
    const fullScreenDiv = $('<div>').addClass('fullscreen');

    // Create an img element and set its source to the imageSrc parameter.
    const fullScreenImage = $('<img>').attr('src', imageSrc);
    // Add the img element to the fullScreenDiv.
    fullScreenDiv.append(fullScreenImage);

    // Create a button with the text 'X' to close the full screen image.
    const closeButton = $('<button>').text('X').addClass('close-button');
    // Add the button to the fullScreenDiv.
    fullScreenDiv.append(closeButton);

    // When the button is clicked, remove the fullScreenDiv from the page.
    closeButton.on('click', () => {
      fullScreenDiv.remove();
    });

    // Add the fullScreenDiv to the page.
    $('body').append(fullScreenDiv);

  });
}

// no image function

/**
 * Replaces all images that fail to load with a placeholder image.
 * 
 * This is useful when the images are loaded from a source
 * and the source is not available.
 * @returns {void}
 */
function noImageSubstitute() {
  const images = document.querySelectorAll('img');
  images.forEach(image => {
    if (image.complete && image.naturalHeight === 0) {
      image.src = 'assets/img/wikimedia-noimg-500px.svg';
      image.classList.add('no-image');
      image.style.cursor = 'default';

      // developer note: dapat mu-provide ug cover art para accessible ang source.
      image.onclick = null;
    }
  });
}

// CALLING FUNCTIONS SECTION

// calling the function onReady upon page load as pre-cursor to main page

// call first this...
noImageSubstitute();

// then this.
onReady(function() {
  setVisible('.page', true);
  setVisible('#loading', false);

  // purpose : to disable right click
  // only re-enable when recommended.

  // $(document).bind("contextmenu",function(e){
  //   e.preventDefault();
  // });
});
