document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContentWrapper = document.querySelector('.nav-content-wrapper');
    const dropdownItems = document.querySelectorAll('.nav-item-with-dropdown');
    
    // Éléments pour le méga menu (bureau)
    const megaMenu = document.querySelector('.dropdown-mega-menu');
    const megaMenuContentContainer = megaMenu ? megaMenu.querySelector('.dropdown-content-container') : null;
    
    // Éléments pour la navigation mobile
    const subNavPanel = document.querySelector('.sub-nav-panel');
    const mobileBackButton = subNavPanel ? subNavPanel.querySelector('.mobile-back-button') : null;
    const mobileNavTitle = subNavPanel ? subNavPanel.querySelector('#mobile-nav-title') : null;
    const subNavContent = subNavPanel ? subNavPanel.querySelector('.sub-nav-content') : null;

    let activeDropdown = null;

    // --- Gestion du menu hamburger (mobile) ---
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = navContentWrapper.classList.toggle('active');
            mobileMenuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = isActive ? 'hidden' : '';
            
            if (!isActive) {
                navContentWrapper.classList.remove('submenu-active');
            }
        });
    }

    // --- Gestion des clics sur les items avec dropdown ---
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        const menuKey = item.dataset.menu;
        const panel = document.getElementById(`${menuKey}-menu`);

        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.innerWidth > 992) {
                    if (panel) handleDesktopDropdown(item, panel);
                } else {
                    if (panel) handleMobileSubmenu(item, panel);
                }
            });
        }
    });
    
    // --- Logique pour le Méga Menu (Bureau) ---
    function handleDesktopDropdown(clickedItem, panel) {
        if (clickedItem.isSameNode(activeDropdown)) {
            closeAllDropdowns();
            return;
        }
        closeAllDropdowns();
        clickedItem.classList.add('active');
        if (megaMenuContentContainer) megaMenuContentContainer.innerHTML = panel.innerHTML;
        if (megaMenu) megaMenu.classList.add('active');
        activeDropdown = clickedItem;
    }

    function closeAllDropdowns() {
        if (activeDropdown) activeDropdown.classList.remove('active');
        if (megaMenu) megaMenu.classList.remove('active');
        activeDropdown = null;
    }
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth > 992 && activeDropdown) {
            if (!e.target.closest('.glass-nav')) closeAllDropdowns();
        }
    });

    // --- Logique pour les Sous-Menus coulissants (Mobile) ---
    function handleMobileSubmenu(item, panel) {
        if (mobileNavTitle) mobileNavTitle.textContent = item.querySelector('a').innerText;
        if (subNavContent) subNavContent.innerHTML = panel.innerHTML;
        if (navContentWrapper) navContentWrapper.classList.add('submenu-active');
    }

    if (mobileBackButton) {
        mobileBackButton.addEventListener('click', () => {
            if (navContentWrapper) navContentWrapper.classList.remove('submenu-active');
        });
    }
    
    // --- Gestion du redimensionnement de la fenêtre ---
    window.addEventListener('resize', () => {
        closeAllDropdowns();
        if (window.innerWidth > 992) {
            if (navContentWrapper) navContentWrapper.classList.remove('active', 'submenu-active');
            if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
});