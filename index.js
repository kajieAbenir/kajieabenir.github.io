// loading screen command set. automatic removal once done.

function onReady(callback) {
    var intervalId = window.setInterval(function() {
      if (document.getElementsByTagName('body')[0] !== undefined) {
        window.clearInterval(intervalId);
        callback.call(this);
      }
    }, 1000);
  }
  
function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
}

// fullscreen picture function

/**
 * Creates a full screen image and appends it to the body.
 * The image will be removable by clicking the close button.
 * @param {string} imageSrc - The source URL of the image to be displayed.
 */
function clickToFullScreen(imageSrc) {
  // Create a div with the class 'fullscreen' to hold the full screen image and the close button.
  const fullScreenDiv = document.createElement('div');
  fullScreenDiv.className = 'fullscreen';

  // Create an img element and set its source to the imageSrc parameter.
  const fullScreenImage = document.createElement('img');
  fullScreenImage.src = imageSrc;
  // Add the img element to the fullScreenDiv.
  fullScreenDiv.appendChild(fullScreenImage);

  // Create a button with the text 'X' to close the full screen image.
  const closeButton = document.createElement('button');
  closeButton.innerText = 'X';
  closeButton.className = 'close-button';
  // Add the button to the fullScreenDiv.
  fullScreenDiv.appendChild(closeButton);

  // When the button is clicked, remove the fullScreenDiv from the page.
  closeButton.addEventListener('click', () => {
    document.body.removeChild(fullScreenDiv);
  });

  // Add the fullScreenDiv to the page.
  document.body.appendChild(fullScreenDiv);
}

// no image function

/**
 * Replaces all images that fail to load with a placeholder image.
 * This is useful when the images are loaded from an external source
 * and the external source is not available.
 * @returns {void}
 */
function noImageSubstitute() {
  const images = document.querySelectorAll('img');
  images.forEach(image => {
    if (image.complete && image.naturalHeight === 0) {
      image.src = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';
      image.className = 'no-image';
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
});

