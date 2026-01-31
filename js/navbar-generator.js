document.addEventListener('DOMContentLoaded', function() {
    const navbarHTML = `
    <!-- Header -->
    <nav class="glass-nav">
        <div class="container">
            <a href="index.html" class="logo">
                <div class="logo-icon">A</div>
                <div class="logo-text">Attic<span>Academy</span></div>
            </a>

            <div class="mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </div>

            <!-- Wrapper for mobile sliding effect -->
            <div class="nav-content-wrapper">
                <div class="nav-panel main-nav-panel">
                    <ul class="nav-links">
                        <li class="nav-item-with-dropdown" data-menu="formations">
                            <a href="#">Formations <i class="fas fa-chevron-down"></i></a>
                        </li>
                        <li><a href="./grande-rentree-fullstack.html">Grande Rentrée</a></li>
                        <li><a href="#parcours">Coût des formation</a></li>
                        <li><a href="#temoignages">Equipe</a></li>
                        <li><a href="#inscription" class="nav-cta">S'inscrire</a></li>
                    </ul>
                </div>

                <div class="nav-panel sub-nav-panel">
                    <div class="mobile-back-button">
                        <i class="fas fa-chevron-left"></i> <span id="mobile-nav-title">Menu</span>
                    </div>
                    <div class="sub-nav-content">
                        <!-- Content injected by JS -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Desktop Mega Menu Container -->
        <div class="dropdown-mega-menu">
            <div class="dropdown-content-container">
                <!-- Content injected by JS -->
            </div>
        </div>
    </nav>

    <!-- Hidden Data Panels for Dropdowns -->
    <div id="formations-menu" class="dropdown-panel">
        <div class="dropdown-column">
            <div class="dropdown-title">Nos Grandes Rentrée</div>
            <a href="grande-rentree-fullstack.html" class="dropdown-link">
                <i class="fas fa-laptop-code"></i>
                <div>
                    <span class="link-title">Web/Mobile/Logiciel  Full-Stack</span>
                    <span class="link-description">HTML, CSS, JS, React, Node, Python,<br> PHP, Flutter...</span>
                </div>
            </a>
            <a href="reseaux-ccna.html" class="dropdown-link">
                <i class="fas fa-network-wired"></i>
                <div>
                    <span class="link-title">Reseaux & CCNA</span>
                    <span class="link-description">Administration infrastructure</span>
                </div>
            </a>
            <a href="#" class="dropdown-link">
                <i class="fas fa-code"></i>
                <div>
                    <span class="link-title">Base Algorithmique</span>
                    <span class="link-description">Maitriser les base Algorithmique avec <br>le C/C++, JAVA et Python</span>
                </div>
            </a>
        </div>
        <div class="dropdown-column">
            <div class="dropdown-title">Formation Individuel</div>
            <a href="formation-programmation.html" class="dropdown-link">
                <i class="fas fa-laptop-code"></i>
                <div>
                    <span class="link-title">Programmation à la Carte</span>
                    <span class="link-description">Python, Java, C++, JS... <br>Pour Étudiants & Pros</span>
                </div>
            </a>
            <a href="#" class="dropdown-link">
                <i class="fas fa-database"></i>
                <div>
                    <span class="link-title">Base de Données</span>
                    <span class="link-description">Maîtriser les bases de données <br>relationnelles et NoSQL</span>
                </div>
            </a>
            <a href="formation-bureautique.html" class="dropdown-link">
                <i class="fas fa-file-word"></i>
                <div>
                    <span class="link-title">Bureautique</span>
                    <span class="link-description">Word, Excel, PowerPoint</span>
                </div>
            </a>
        </div>
    </div>
    `;

    const placeholder = document.getElementById('navbar-placeholder');
    if (placeholder) {
        placeholder.outerHTML = navbarHTML;
    }
});