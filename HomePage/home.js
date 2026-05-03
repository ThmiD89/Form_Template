/* ============================================================
   home.js  –  Homepage JavaScript
   
   WHAT THIS FILE DOES:
   1. Add photos from your computer → show them in a grid
   2. Delete photos from the grid
   3. Click a photo → opens it fullscreen (lightbox)
   4. Add videos from your computer → show them in a grid
   5. Add YouTube videos by pasting a link
   6. Delete videos from the grid
   7. Show/hide the "Add Video" panel
   8. Switch between Upload and YouTube tabs
   9. Show toast (popup) notifications
   ============================================================ */


/* ─────────────────────────────────────────
   SECTION 1 — PHOTOS
───────────────────────────────────────── */

/*
  This function runs when the user picks photos using the file input.
  "input" is the <input type="file"> element.
  "input.files" is a list of the files the user selected.
*/
function addPhotos(input) {

  // "files" is the list of chosen files
  const files = input.files;

  // If no files were chosen, stop here
  if (files.length === 0) return;

  // Get the grid container where photos will appear
  const grid = document.getElementById('photo-grid');

  // Hide the "No photos yet" empty message
  document.getElementById('photo-empty').style.display = 'none';

  // Loop through every selected file
  for (let i = 0; i < files.length; i++) {

    const file = files[i];

    // Make sure it's an image file (jpg, png, gif, etc.)
    if (!file.type.startsWith('image/')) {
      showToast('⚠ Only image files are allowed');
      continue; // skip this file, go to next
    }

    /*
      FileReader lets us read the file's data as a URL (base64 string)
      so we can show it directly on the page without uploading to a server.
    */
    const reader = new FileReader();

    /*
      This runs when the FileReader has finished reading the file.
      "e.target.result" is the image data URL (looks like: data:image/jpeg;base64,...)
    */
    reader.onload = function(e) {

      // Create the photo card element
      const card = document.createElement('div');
      card.className = 'photo-card';

      // Put an image and a delete button inside the card
      card.innerHTML = `
        <img src="${e.target.result}" alt="Uploaded photo" />
        <button class="delete-btn" onclick="deleteCard(this, 'photo-grid', 'photo-empty')" title="Delete photo">✕</button>
      `;

      // Clicking the photo (not the delete button) opens it fullscreen
      card.querySelector('img').addEventListener('click', function() {
        openLightbox(e.target.result);
      });

      // Add the card to the grid
      grid.appendChild(card);

    };

    // Start reading the file — this triggers the onload above
    reader.readAsDataURL(file);
  }

  // Reset the file input so the same file can be uploaded again if needed
  input.value = '';

  showToast('✓ Photo(s) added!');
}


/* ─────────────────────────────────────────
   SECTION 2 — LIGHTBOX (fullscreen photo)
───────────────────────────────────────── */

// Create the lightbox HTML once and add it to the page
const lightboxEl = document.createElement('div');
lightboxEl.className = 'lightbox';
lightboxEl.innerHTML = `
  <button class="lightbox-close" onclick="closeLightbox()">✕</button>
  <img id="lightbox-img" src="" alt="Full size photo" />
`;
document.body.appendChild(lightboxEl);

/*
  Open the lightbox with a given image URL.
  Sets the src of the lightbox image and shows it.
*/
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  lightboxEl.classList.add('open');
  // Pressing Escape also closes it
  document.addEventListener('keydown', handleEscKey);
}

/* Close the lightbox */
function closeLightbox() {
  lightboxEl.classList.remove('open');
  document.removeEventListener('keydown', handleEscKey);
}

/* Close lightbox when user presses the Escape key */
function handleEscKey(e) {
  if (e.key === 'Escape') closeLightbox();
}

/* Also close if user clicks the dark background (not the image) */
lightboxEl.addEventListener('click', function(e) {
  if (e.target === lightboxEl) closeLightbox();
});


/* ─────────────────────────────────────────
   SECTION 3 — VIDEO FILE UPLOAD
───────────────────────────────────────── */

/*
  Runs when the user picks a video file.
  Works exactly like photos but creates a <video> element instead.
*/
function addVideoFile(input) {

  const files = input.files;

  if (files.length === 0) return;

  const grid = document.getElementById('video-grid');

  // Hide the empty message
  document.getElementById('video-empty').style.display = 'none';

  for (let i = 0; i < files.length; i++) {

    const file = files[i];

    // Make sure it's a video file
    if (!file.type.startsWith('video/')) {
      showToast('⚠ Only video files are allowed');
      continue;
    }

    // Create a temporary URL for the video file
    // (This is faster than FileReader for videos)
    const videoURL = URL.createObjectURL(file);

    // Create the video card
    const card = document.createElement('div');
    card.className = 'video-card';

    // Get just the filename without the path
    const name = file.name;

    card.innerHTML = `
      <video controls src="${videoURL}"></video>
      <div class="video-label">
        <span>🎬 ${name}</span>
        <button class="delete-btn" onclick="deleteCard(this, 'video-grid', 'video-empty')">Delete</button>
      </div>
    `;

    grid.appendChild(card);
  }

  // Reset input
  input.value = '';

  // Close the panel after adding
  closeVideoPanel();

  showToast('✓ Video added!');
}


/* ─────────────────────────────────────────
   SECTION 4 — YOUTUBE VIDEO
───────────────────────────────────────── */

/*
  Takes a YouTube URL and converts it to an embeddable URL.
  
  YouTube URLs look like:
    https://www.youtube.com/watch?v=dQw4w9WgXcQ
    https://youtu.be/dQw4w9WgXcQ
  
  We need to turn them into:
    https://www.youtube.com/embed/dQw4w9WgXcQ
*/
function getYouTubeEmbedURL(url) {

  // Try the standard "watch?v=" format
  let match = url.match(/[?&]v=([^&]+)/);

  if (match) {
    return 'https://www.youtube.com/embed/' + match[1];
  }

  // Try the short "youtu.be/" format
  match = url.match(/youtu\.be\/([^?&]+)/);

  if (match) {
    return 'https://www.youtube.com/embed/' + match[1];
  }

  // Not a valid YouTube URL
  return null;
}

/* Runs when user clicks "Add" for YouTube */
function addYouTubeVideo() {

  // Get the URL the user typed
  const input = document.getElementById('yt-input');
  const url   = input.value.trim();

  // Check if they typed anything
  if (!url) {
    showToast('⚠ Please paste a YouTube URL first');
    return;
  }

  // Convert to embed URL
  const embedURL = getYouTubeEmbedURL(url);

  // If conversion failed, it wasn't a valid YouTube link
  if (!embedURL) {
    showToast('⚠ That doesn\'t look like a valid YouTube URL');
    return;
  }

  const grid = document.getElementById('video-grid');

  // Hide the empty message
  document.getElementById('video-empty').style.display = 'none';

  // Create a video card with an iframe (used to embed YouTube)
  const card = document.createElement('div');
  card.className = 'video-card';

  card.innerHTML = `
    <iframe
      src="${embedURL}"
      title="YouTube video"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <div class="video-label">
      <span>▶ YouTube Video</span>
      <button class="delete-btn" onclick="deleteCard(this, 'video-grid', 'video-empty')">Delete</button>
    </div>
  `;

  grid.appendChild(card);

  // Clear the text input
  input.value = '';

  // Close the panel
  closeVideoPanel();

  showToast('✓ YouTube video added!');
}


/* ─────────────────────────────────────────
   SECTION 5 — PANEL & TAB CONTROLS
───────────────────────────────────────── */

/*
  Toggle (show/hide) the "Add Video" panel.
  Called when user clicks "+ Add Video" button.
*/
function toggleVideoPanel() {
  const panel = document.getElementById('video-panel');
  panel.classList.toggle('open');
}

/* Force close the panel */
function closeVideoPanel() {
  document.getElementById('video-panel').classList.remove('open');
}

/*
  Switch between "Upload File" and "YouTube Link" tabs
  inside the video panel.
  
  "tabName" is either 'upload' or 'youtube'
*/
function switchTab(tabName) {

  // Show/hide the tab content divs
  document.getElementById('tab-upload').style.display  = tabName === 'upload'  ? 'block' : 'none';
  document.getElementById('tab-youtube').style.display = tabName === 'youtube' ? 'block' : 'none';

  // Update tab button styles (which one looks "active")
  const allTabs = document.querySelectorAll('.panel-tab');

  allTabs.forEach(function(btn) {
    // Remove active class from all tabs
    btn.classList.remove('active');
  });

  // Find the clicked tab button and make it active
  // The buttons call switchTab('upload') or switchTab('youtube')
  // We match them by checking their text content
  allTabs.forEach(function(btn) {
    if (
      (tabName === 'upload'  && btn.textContent === 'Upload File') ||
      (tabName === 'youtube' && btn.textContent === 'YouTube Link')
    ) {
      btn.classList.add('active');
    }
  });
}


/* ─────────────────────────────────────────
   SECTION 6 — DELETE A CARD
───────────────────────────────────────── */

/*
  Deletes a photo or video card from the grid.
  
  Parameters:
  - btn       : the delete button that was clicked
  - gridId    : the ID of the grid ("photo-grid" or "video-grid")
  - emptyId   : the ID of the empty state ("photo-empty" or "video-empty")
*/
function deleteCard(btn, gridId, emptyId) {

  // Get the card (the button's parent is the label, card is one more up — or it IS the card)
  const card = btn.closest('.photo-card') || btn.closest('.video-card');

  if (!card) return;

  // Remove the card from the page
  card.remove();

  // Check if the grid is now empty (only the empty-state div left)
  const grid = document.getElementById(gridId);
  const remainingCards = grid.querySelectorAll('.photo-card, .video-card');

  if (remainingCards.length === 0) {
    // Show the empty message again
    document.getElementById(emptyId).style.display = '';
  }

  showToast('Deleted');
}


/* ─────────────────────────────────────────
   SECTION 7 — TOAST NOTIFICATION
───────────────────────────────────────── */

/*
  Shows a small popup message at the bottom of the screen.
  It disappears automatically after 3 seconds.
  
  Usage: showToast('Hello!')
*/
function showToast(message) {

  const toast = document.getElementById('toast');

  // Set the message text
  toast.textContent = message;

  // Make it visible (CSS class adds opacity + slides it up)
  toast.classList.add('show');

  // After 3 seconds, hide it again
  // clearTimeout prevents multiple timers stacking up
  clearTimeout(toast._hideTimer);

  toast._hideTimer = setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}
