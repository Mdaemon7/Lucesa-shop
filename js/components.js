        const navLinks = document.querySelectorAll('#navbarCollapse .navbar-nav .nav-link');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    loadComponent("#header-placeholder", "_header.html", setActiveNavLink);
    loadComponent("#footer-placeholder", "_footer.html");
});
