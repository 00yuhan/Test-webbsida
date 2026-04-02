/**
 * ROBUST DIALOG HANDLER
 * Works on any page, whether it has videos or just images.
 */

// 1. Helper to toggle scroll lock (Targets both body and html)
const toggleScrollLock = (shouldLock) => {
    const style = shouldLock ? 'hidden' : '';
    document.body.style.overflow = style;
    document.documentElement.style.overflow = style;
};

// 2. Setup closing behavior for ALL dialogs
document.querySelectorAll('dialog').forEach(dialog => {
    // Close on backdrop click
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) dialog.close();
    });

    // Cleanup when ANY dialog closes
    dialog.addEventListener('close', () => {
        toggleScrollLock(false); // Re-enable scroll

        // Only try to clean up video if a video element actually exists in this dialog
        const video = dialog.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
            video.src = "";
            video.load(); // Reset to prevent grey screen
        }
    });
});

// 3. Open Image/Video Dialog
function openImage(element) {
    const dialog = document.getElementById('imageDialog');
    if (!dialog) return; // Exit if the main dialog doesn't exist on this page

    toggleScrollLock(true); // Lock scroll

    // Elements inside the dialog
    const fullImage = document.getElementById('fullImage');
    const dialogVideo = document.getElementById('dialogVideo');
    const dialogTitle = document.getElementById('dialogTitle');

// Handle Image
if (fullImage) {
    // Look for data-full-src. If it's missing, just use the normal src.
    const alternateImg = element.getAttribute('data-full-src');
    fullImage.src = alternateImg ? alternateImg : element.src;
}

    // Handle Title
    if (dialogTitle) {
        const title = element.getAttribute('data-title');
        dialogTitle.innerText = title || "";
        dialogTitle.style.display = title ? "block" : "none";
    }

    // Handle Video (ONLY if video element exists on this page)
    const videoSrc = element.getAttribute('data-video');
    if (dialogVideo) {
        if (videoSrc) {
            dialogVideo.src = videoSrc;
            dialogVideo.style.display = "block";
            dialogVideo.load();
            dialogVideo.play();
        } else {
            dialogVideo.style.display = "none";
            dialogVideo.src = "";
            dialogVideo.load();
        }
    }

    dialog.showModal();
}

// 4. Sidebar helpers remain the same
function openSidebar(id) {
    const dialog = document.getElementById(id);
    if (dialog) {
        toggleScrollLock(true);
        dialog.showModal();
    }
}

function closeSidebar(id) {
    const dialog = document.getElementById(id);
    if (dialog) dialog.close();
}