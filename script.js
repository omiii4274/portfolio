let menuIcon = document.querySelector('#menu-icon') || document.querySelector('.menu-btn');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (id && top >= offset && top < offset + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            let currentLink = document.querySelector('header nav a[href*="' + id + '"]');
            if (currentLink) {
                currentLink.classList.add('active');
            }
        }
    });

    // Close mobile navbar on scroll if open
    if (navbar && navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        if (menuIcon) {
            menuIcon.classList.remove('bx-x');
        }
    }
};

if (menuIcon) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}

// Close mobile navbar when any nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navbar && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            if (menuIcon) {
                menuIcon.classList.remove('bx-x');
            }
        }
    });
});
