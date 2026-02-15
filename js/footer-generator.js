document.addEventListener('DOMContentLoaded', function() {
    const footerHTML = `
    <section class="section bg-light text-center" style="padding: 80px 0; border-top: 1px solid var(--border-color);">
        <div class="container">
            <h2 style="margin-bottom: 16px; font-size: 2rem; color: var(--text-primary);">Que voulez-vous apprendre ?</h2>
            <p style="margin-bottom: 32px; color: var(--text-secondary); max-width: 600px; margin-left: auto; margin-right: auto;">
                Vous ne trouvez pas la formation idéale dans notre catalogue ? Dites-nous ce que vous cherchez, nous pouvons créer un programme sur mesure pour vous.
            </p>
            <button class="cta-button-large open-besoin-modal-btn">Décrire mon besoin</button>
        </div>
    </section>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-about">
                    <div class="footer-logo">
                        <img src="./assets/svg/iconeFondBlanc.svg" alt="icone_bammite" class="logo-placeholder">
                        <img src="./assets/svg/logoblanc.svg" alt="logo_bammite" class="logo-placeholder">
                    </div>
                    <p class="footer-desc">
                        Bammite est un centre de formation tech innovant.
                        Nous formons la nouvelle génération de développeurs avec une approche pratique et un accompagnement personnalisé vers l'excellence.
                    </p>
                </div>

                <div class="footer-links">
                    <h4>Formations</h4>
                    <ul>
                        <li><a href="reseaux-ccna.html">Réseaux</a></li>
                        <li><a href="formation-bureautique.html">Bureautique</a></li>
                        <li><a href="formation-programmation.html">Administration BDD</a></li>
                        <li><a href="web-mobile-logiciel.html#mobile">Développement Mobile</a></li>
                        <li><a href="web-mobile-logiciel.html#logiciel">Génie Logiciel</a></li>
                    </ul>
                </div>

                <div class="footer-links">
                    <h4>Contact</h4>
                    <ul>
                        <li><a href="mailto:contact@bammite.com">contact@bammite.com</a></li>
                        <li><a href="tel:+221709442677">+221 70 944 26 77</a></li>
                        <li><a href="mailto:contact@bammite.com">Demande de brochure</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2026 Bammite — Tous droits réservés. Formations en développement web, mobile, logiciel, Python
                    et administration de bases de données.</p>
            </div>
        </div>
    </footer>

    <a href="https://wa.me/221709442677" target="_blank" class="floating-whatsapp" title="Discuter sur WhatsApp">
        <i class="fab fa-whatsapp"></i>
    </a>
    `;

    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.outerHTML = footerHTML;
    }
});