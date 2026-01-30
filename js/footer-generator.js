document.addEventListener('DOMContentLoaded', function() {
    const footerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-about">
                    <div class="footer-logo">
                        <div class="logo-icon">A</div>
                        <div class="logo-text">Attic<span>Academy</span></div>
                    </div>
                    <p class="footer-desc">
                        AtticAcademy est le centre de formation tech leader en France.
                        Nous accompagnons depuis 2018 des milliers de professionnels et passionnés vers l'excellence en
                        développement web, mobile, logiciel et data.
                    </p>
                </div>

                <div class="footer-links">
                    <h4>Formations</h4>
                    <ul>
                        <li><a href="web-mobile-logiciel.html#web">Développement Web</a></li>
                        <li><a href="#">Python & Data Science</a></li>
                        <li><a href="#">Administration BDD</a></li>
                        <li><a href="web-mobile-logiciel.html#mobile">Développement Mobile</a></li>
                        <li><a href="web-mobile-logiciel.html#logiciel">Génie Logiciel</a></li>
                    </ul>
                </div>

                <div class="footer-links">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="mailto:info@atticacademy.fr">info@atticacademy.fr</a></li>
                        <li><a href="tel:+33123456789">01 23 45 67 89</a></li>
                        <li><a href="#">Eligibilité CPF</a></li>
                        <li><a href="#">Demande de brochure</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2024 AtticAcademy — Tous droits réservés. Formations en développement web, mobile, logiciel, Python
                    et administration de bases de données.</p>
            </div>
        </div>
    </footer>
    `;

    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.outerHTML = footerHTML;
    }
});