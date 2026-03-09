// New navbar.js
document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.nav-list');
    const navItems = document.querySelectorAll('.nav-list a');

    if (menu && menuLinks) {
        menu.addEventListener('click', function() {
            menuLinks.classList.toggle('active');
            menu.classList.toggle('is-active'); 
        });

        navItems.forEach(link => {
            link.addEventListener('click', () => {
                menuLinks.classList.remove('active');
                menu.classList.remove('is-active');
            });
        });
    }
});
