// ---------- STORAGE ----------
let mediaItems = [];

// Load from localStorage
function loadFromStorage() {
    const stored = localStorage.getItem('dreamspace_gallery');
    if(stored) {
        mediaItems = JSON.parse(stored);
    } else {
        // Add 3 beautiful demo items (beginner friendly)
        mediaItems = [
            {
                id: Date.now() + 1,
                title: "Mountain Serenity",
                url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
                type: "photo",
                createdAt: Date.now()
            },
            {
                id: Date.now() + 2,
                title: "Ocean Waves",
                url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
                type: "photo",
                createdAt: Date.now()
            },
            {
                id: Date.now() + 3,
                title: "Sample aerial view (video demo)",
                url: "sample.mp4",
                type: "video",
                createdAt: Date.now()
            }
        ];
    }
    renderGallery();
}

// Save to localStorage
function saveToStorage() {
    localStorage.setItem('dreamspace_gallery', JSON.stringify(mediaItems));
}

// Helper: validate URL (simple but works)
function isValidMediaUrl(url, type) {
    if(!url || url.trim() === "") return false;
    // basic: must start with http
    if(!url.startsWith('http')) return false;
    if(type === 'photo') {
        return (url.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) !== null) || 
               url.includes('unsplash.com') || url.includes('images.') || url.includes('picsum');
    } else if(type === 'video') {
        return (url.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i) !== null) || url.includes('video');
    }
    return true;
}

// Add new media
function addMediaItem(title, url, type) {
    if(!title.trim()) {
        alert("✨ Please add a title for your media!");
        return false;
    }
    if(!url.trim()) {
        alert("📎 Please enter a valid image or video URL");
        return false;
    }
    if(!isValidMediaUrl(url, type)) {
        if(type === 'photo') {
            alert("📸 For photos, use a direct image URL ending with .jpg, .png, or a working image link.\n\nTip: Try Unsplash or placeholder images.");
        } else {
            alert("🎬 For videos, use a direct .mp4 link (sample: https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4)");
        }
        return false;
    }

    const newItem = {
        id: Date.now(),
        title: title.trim(),
        url: url.trim(),
        type: type,
        createdAt: Date.now()
    };
    mediaItems.unshift(newItem); // newest first
    saveToStorage();
    renderGallery();
    return true;
}

// Delete item
function deleteItem(id) {
    mediaItems = mediaItems.filter(item => item.id !== id);
    saveToStorage();
    renderGallery();
    showToast("🗑️ Removed from gallery", "#f1f5f9");
}

// Clear all media
function clearAllMedia() {
    if(mediaItems.length === 0) return;
    if(confirm("⚠️ Delete all photos & videos from your gallery?")) {
        mediaItems = [];
        saveToStorage();
        renderGallery();
        showToast("Gallery cleared ✨", "#eef2ff");
    }
}

// Simple inline toast (no external div)
function showToast(msg, bgColor = "#1e293b") {
    let toast = document.getElementById('dynamicToast');
    if(!toast) {
        toast = document.createElement('div');
        toast.id = 'dynamicToast';
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = bgColor;
        toast.style.color = 'white';
        toast.style.padding = '12px 28px';
        toast.style.borderRadius = '60px';
        toast.style.fontWeight = '500';
        toast.style.fontSize = '0.9rem';
        toast.style.zIndex = '999';
        toast.style.backdropFilter = 'blur(10px)';
        toast.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
        toast.style.transition = 'opacity 0.2s';
        document.body.appendChild(toast);
    }
    toast.style.backgroundColor = bgColor;
    toast.textContent = msg;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if(toast && toast.parentNode) toast.remove();
        }, 300);
    }, 2000);
}

// ----- RENDER GALLERY with FILTER -----
let currentFilter = "all"; // all, photo, video

function renderGallery() {
    const gridContainer = document.getElementById('mediaGrid');
    if(!gridContainer) return;
    
    let filteredItems = mediaItems;
    if(currentFilter === 'photo') {
        filteredItems = mediaItems.filter(item => item.type === 'photo');
    } else if(currentFilter === 'video') {
        filteredItems = mediaItems.filter(item => item.type === 'video');
    }

    if(filteredItems.length === 0) {
        gridContainer.innerHTML = `
            <div class="empty-gallery">
                <span>🌟</span>
                <h3>Your gallery feels empty</h3>
                <p style="margin-top: 8px;">Add a beautiful photo or video using the form above ✨</p>
            </div>
        `;
        return;
    }

    let html = '';
    for(let item of filteredItems) {
        const isVideo = item.type === 'video';
        // Media preview logic
        let mediaTag = '';
        if(isVideo) {
            mediaTag = `<video src="${escapeHtml(item.url)}" controls preload="metadata"></video>`;
        } else {
            mediaTag = `<img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='https://placehold.co/600x400/e2e8f0/94a3b8?text=Image+not+load'; this.onerror=null">`;
        }
        
        html += `
            <div class="media-card" data-id="${item.id}">
                <div class="media-preview">
                    ${mediaTag}
                    <div class="media-badge">${isVideo ? '🎥 VIDEO' : '📷 PHOTO'}</div>
                </div>
                <div class="media-info">
                    <div class="media-title">${escapeHtml(item.title)}</div>
                    <div class="media-url">${truncateUrl(item.url, 45)}</div>
                    <button class="delete-btn" data-id="${item.id}">🗑️ Remove</button>
                </div>
            </div>
        `;
    }
    gridContainer.innerHTML = html;

    // Attach delete events
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            deleteItem(id);
        });
    });
}

// Helper escape dangerous characters
function escapeHtml(str) {
    if(!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if(m === '&') return '&amp;';
        if(m === '<') return '&lt;';
        if(m === '>') return '&gt;';
        return m;
    }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c) {
        return c;
    });
}

function truncateUrl(url, maxLen) {
    if(url.length <= maxLen) return url;
    return url.slice(0, maxLen-3) + '...';
}

// filter + highlight
function setupFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.getAttribute('data-filter');
            renderGallery();
        });
    });
}

// Event: Add media
document.getElementById('addMediaBtn')?.addEventListener('click', () => {
    const title = document.getElementById('mediaTitle').value;
    const url = document.getElementById('mediaUrl').value;
    let selectedType = 'photo';
    const radioBtns = document.querySelectorAll('input[name="mediaType"]');
    for(let rb of radioBtns) {
        if(rb.checked) {
            selectedType = rb.value;
            break;
        }
    }
    const success = addMediaItem(title, url, selectedType);
    if(success) {
        // Clear inputs after successful addition
        document.getElementById('mediaTitle').value = '';
        document.getElementById('mediaUrl').value = '';
        showToast(`✔️ ${selectedType === 'photo' ? 'Photo' : 'Video'} added!`, '#4f46e5');
    }
});

// Clear All button
document.getElementById('clearAllBtn')?.addEventListener('click', clearAllMedia);

// Enter key support on url field
const urlInput = document.getElementById('mediaUrl');
if(urlInput) {
    urlInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('addMediaBtn').click();
        }
    });
}

// initial load
loadFromStorage();
setupFilters();

// small fix for image loading fallback - global
window.addEventListener('error', function(e) {
    if(e.target.tagName === 'IMG') {
        if(!e.target.hasAttribute('data-fallback')) {
            e.target.setAttribute('data-fallback', 'true');
            e.target.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=📸+Preview+unavailable';
        }
    }
}, true);