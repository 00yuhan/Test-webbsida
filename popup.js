const dialog = document.getElementById('imageDialog');
const fullImg = document.getElementById('fullImage');

function openImage(src) {
    fullImg.src = src;   // Sets the pop-up image source to the clicked image source
    dialog.showModal();  // This is a built-in function for <dialog>
}