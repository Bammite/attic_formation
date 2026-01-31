document.addEventListener('DOMContentLoaded', function() {
    // 1. Injection du HTML des Modals
    const modalsHTML = `
    <!-- Modal Formation à la carte -->
    <div id="inscription-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Construisez votre parcours</h2>
            <p>Remplissez ce formulaire pour définir votre programme personnalisé.</p>
            <form id="modal-form" class="contact-form" style="box-shadow:none; padding:0; border:none;">
                <div class="form-group">
                    <label for="modal-domain">Domaine à assimiler</label>
                    <select id="modal-domain" required>
                        <option value="">Choisir une technologie...</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="java">Java</option>
                        <option value="react">React</option>
                        <option value="php">PHP / Laravel</option>
                        <option value="cpp">C / C++</option>
                        <option value="flutter">Flutter</option>
                        <option value="git">Git & DevOps</option>
                        <option value="bureautique">Bureautique (Office)</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="modal-name">Nom complet</label>
                    <input type="text" id="modal-name" required>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="modal-email">Email</label><input type="email" id="modal-email" required></div>
                    <div class="form-group"><label for="modal-phone">Numéro (optionnel)</label><input type="tel" id="modal-phone"></div>
                </div>
                <div class="form-group">
                    <label>Préférence de formation</label>
                    <div class="radio-group">
                        <label><input type="radio" name="mode" value="online" checked> En ligne</label>
                        <label><input type="radio" name="mode" value="presentiel"> Présentiel</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="modal-source">Où avez-vous entendu parler de nous ?</label>
                    <select id="modal-source">
                        <option value="">Sélectionner...</option>
                        <option value="google">Recherche Google</option>
                        <option value="social">Réseaux Sociaux</option>
                        <option value="friend">Recommandation</option>
                        <option value="other">Autre</option>
                    </select>
                </div>
                <button type="submit" class="cta-button-large" style="width:100%">Envoyer ma demande</button>
            </form>
        </div>
    </div>

    <!-- Modal Grande Rentrée -->
    <div id="rentree-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Candidature Grande Rentrée</h2>
            <p>Rejoignez la prochaine cohorte et transformez votre carrière.</p>
            <form id="rentree-modal-form" class="contact-form" style="box-shadow:none; padding:0; border:none;">
                <div class="form-group">
                    <label for="rentree-name">Nom complet</label>
                    <input type="text" id="rentree-name" required>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="rentree-email">Email</label><input type="email" id="rentree-email" required></div>
                    <div class="form-group"><label for="rentree-phone">Téléphone</label><input type="tel" id="rentree-phone" required></div>
                </div>
                <div class="form-group">
                    <label for="rentree-motivation">Vos motivations</label>
                    <textarea id="rentree-motivation" rows="3" placeholder="Pourquoi cette formation ?"></textarea>
                </div>
                 <div class="form-group">
                    <label>Financement</label>
                    <select id="rentree-funding">
                        <option value="personnel">Financement personnel</option>
                        <option value="cpf">Compte Personnel de Formation (CPF)</option>
                        <option value="entreprise">Financement entreprise</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>
                <button type="submit" class="cta-button-large" style="width:100%">Envoyer ma candidature</button>
            </form>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalsHTML);

    // 2. Gestion de la logique des Modals (Délégation d'événements)
    document.addEventListener('click', function(e) {
        // Ouverture Modal "Formation à la carte"
        const btnCarte = e.target.closest('.open-modal-btn');
        if (btnCarte) {
            e.preventDefault();
            const domainSelect = document.getElementById('modal-domain');
            if (domainSelect && btnCarte.dataset.domain) {
                domainSelect.value = btnCarte.dataset.domain;
            }
            document.getElementById('inscription-modal').style.display = "block";
        }

        // Ouverture Modal "Grande Rentrée"
        const btnRentree = e.target.closest('.open-rentree-modal-btn');
        if (btnRentree) {
            e.preventDefault();
            document.getElementById('rentree-modal').style.display = "block";
        }

        // Fermeture (Bouton X ou clic extérieur)
        if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
            const modal = e.target.closest('.modal') || e.target;
            modal.style.display = "none";
        }
    });

    const form = document.getElementById('modal-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Merci ! Votre demande a été reçue. Un conseiller vous contactera bientôt.');
            document.getElementById('inscription-modal').style.display = "none";
            this.reset();
        });
    }

    const formRentree = document.getElementById('rentree-modal-form');
    if (formRentree) {
        formRentree.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Félicitations ! Votre candidature pour la Grande Rentrée a été enregistrée. Un conseiller va vous contacter.');
            document.getElementById('rentree-modal').style.display = "none";
            this.reset();
        });
    }
});