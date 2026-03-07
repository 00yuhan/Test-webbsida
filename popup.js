/**const dialog = document.getElementById('imageDialog');
const fullImg = document.getElementById('fullImage');

function openImage(src) {
    fullImg.src = src;   // Sets the pop-up image source to the clicked image source
    dialog.showModal();  // This is a built-in function for <dialog>
}
**/

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