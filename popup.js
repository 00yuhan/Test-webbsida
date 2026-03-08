const dialog = document.getElementById('imageDialog');
const fullImg = document.getElementById('fullImage');

function openImage(imgElement) {
    const dialog = document.getElementById('imageDialog');
    const fullImg = document.getElementById('fullImage');
    const titleText = document.getElementById('dialogTitle');

    if (!dialog || !fullImg) return;

    // 1. Set the image
    fullImg.src = imgElement.src; 
    
    // 2. ONLY set the title if the 'dialogTitle' element exists in your HTML
    if (titleText) {
        const title = imgElement.getAttribute('data-title');
        titleText.innerText = title || ""; 
        // Hide the element entirely if there's no text to show
        titleText.style.display = title ? "block" : "none";
    }
    
    dialog.showModal(); 
}

// Function to open any dialog by its ID
function openSidebar(id) {
    const dialog = document.getElementById(id);
    if (dialog) {
        dialog.showModal(); // This is the built-in magic for popups
    }
}

// Function to close any dialog by its ID
function closeSidebar(id) {
    const dialog = document.getElementById(id);
    if (dialog) {
        dialog.close();
    }
}

// Close dialog when clicking on the backdrop (the dark area)
const allDialogs = document.querySelectorAll('dialog');
allDialogs.forEach(dialog => {
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.close();
        }
    });
});