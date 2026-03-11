document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.nav-list');
    const navItems = document.querySelectorAll('.nav-list a');
    const body = document.body; // Target the body for scroll locking

    if (menu && menuLinks) {
        menu.addEventListener('click', function () {
            menuLinks.classList.toggle('active');
            menu.classList.toggle('is-active');
            // Toggle scroll lock
            body.classList.toggle('no-scroll');
        });

        navItems.forEach(link => {
            link.addEventListener('click', () => {
                menuLinks.classList.remove('active');
                menu.classList.remove('is-active');
                // Ensure scroll is restored when clicking a link
                body.classList.remove('no-scroll');
            });
        });
    }
});


/*
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
*/
