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
                    <select id="modal-domain" name="domain" required>
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
                    <input type="text" id="modal-name" name="name" required>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="modal-email">Email</label><input type="email" id="modal-email" name="email" required></div>
                    <div class="form-group"><label for="modal-phone">Numéro (optionnel)</label><input type="tel" id="modal-phone" name="phone"></div>
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
                    <select id="modal-source" name="source">
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
                    <input type="text" id="rentree-name" name="name" required>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="rentree-email">Email</label><input type="email" id="rentree-email" name="email" required></div>
                    <div class="form-group"><label for="rentree-phone">Téléphone</label><input type="tel" id="rentree-phone" name="phone" required></div>
                </div>
                <div class="form-group">
                    <label for="rentree-motivation">Vos motivations</label>
                    <textarea id="rentree-motivation" name="motivation" rows="3" placeholder="Pourquoi cette formation ?"></textarea>
                </div>
                 <div class="form-group">
                    <label>Financement</label>
                    <select id="rentree-funding" name="funding">
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

    <!-- Modal Besoin Spécifique -->
    <div id="besoin-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Que voulez-vous apprendre ?</h2>
            <p>Décrivez votre besoin spécifique, nous construirons le parcours adapté.</p>
            <form id="besoin-modal-form" class="contact-form" style="box-shadow:none; padding:0; border:none;">
                <div class="form-group">
                    <label for="besoin-name">Nom complet</label>
                    <input type="text" id="besoin-name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="besoin-email">Email</label>
                    <input type="email" id="besoin-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="besoin-desc">Votre besoin en détails</label>
                    <textarea id="besoin-desc" name="description" rows="4" placeholder="Technologies, objectifs, contraintes..." required></textarea>
                </div>
                <button type="submit" class="cta-button-large" style="width:100%">Envoyer ma demande</button>
            </form>
        </div>
    </div>

    <!-- Modal Web Mobile Logiciel -->
    <div id="wml-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Inscription Formation Complète</h2>
            <p>Web, Mobile & Logiciel : Devenez un développeur polyvalent.</p>
            <form id="wml-modal-form" class="contact-form" style="box-shadow:none; padding:0; border:none;">
                <div class="form-group">
                    <label for="wml-name">Nom complet</label>
                    <input type="text" id="wml-name" name="name" required>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="wml-email">Email</label><input type="email" id="wml-email" name="email" required></div>
                    <div class="form-group"><label for="wml-phone">Téléphone</label><input type="tel" id="wml-phone" name="phone" required></div>
                </div>
                <div class="form-group">
                    <label for="wml-track">Parcours principal visé</label>
                    <select id="wml-track" name="track">
                        <option value="all">Cursus Complet (Web + Mobile + Logiciel)</option>
                        <option value="web">Spécialisation Web</option>
                        <option value="mobile">Spécialisation Mobile</option>
                        <option value="logiciel">Spécialisation Logiciel</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Niveau actuel</label>
                    <div class="radio-group">
                        <label><input type="radio" name="level" value="beginner" checked> Débutant</label>
                        <label><input type="radio" name="level" value="intermediate"> Intermédiaire</label>
                        <label><input type="radio" name="level" value="advanced"> Avancé</label>
                    </div>
                </div>
                <button type="submit" class="cta-button-large" style="width:100%">Valider mon inscription</button>
            </form>
        </div>
    </div>

    <!-- Modal CCNA -->
    <div id="ccna-modal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Inscription Formation CCNA</h2>
            <p>Devenez expert réseaux certifié Cisco.</p>
            <form id="ccna-modal-form" class="contact-form" style="box-shadow:none; padding:0; border:none;">
                <div class="form-group">
                    <label for="ccna-name">Nom complet</label>
                    <input type="text" id="ccna-name" name="name" required>
                </div>
                <div class="form-row">
                    <div class="form-group"><label for="ccna-email">Email</label><input type="email" id="ccna-email" name="email" required></div>
                    <div class="form-group"><label for="ccna-phone">Téléphone</label><input type="tel" id="ccna-phone" name="phone" required></div>
                </div>
                <div class="form-group">
                    <label>Statut actuel</label>
                    <select id="ccna-status" name="status">
                        <option value="student">Étudiant</option>
                        <option value="professional">Professionnel</option>
                        <option value="job_seeker">En recherche d'emploi</option>
                    </select>
                </div>
                <button type="submit" class="cta-button-large" style="width:100%">Valider mon inscription</button>
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

        // Ouverture Modal "Besoin Spécifique"
        const btnBesoin = e.target.closest('.open-besoin-modal-btn');
        if (btnBesoin) {
            e.preventDefault();
            document.getElementById('besoin-modal').style.display = "block";
        }

        // Ouverture Modal "Web Mobile Logiciel"
        const btnWml = e.target.closest('.open-wml-modal-btn');
        if (btnWml) {
            e.preventDefault();
            document.getElementById('wml-modal').style.display = "block";
        }

        // Ouverture Modal "CCNA"
        const btnCcna = e.target.closest('.open-ccna-modal-btn');
        if (btnCcna) {
            e.preventDefault();
            document.getElementById('ccna-modal').style.display = "block";
        }

        // Fermeture (Bouton X ou clic extérieur)
        if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
            const modal = e.target.closest('.modal') || e.target;
            modal.style.display = "none";
        }
    });

    // 5. Système de Notification Toast
    function showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';

        toast.innerHTML = `
            <i class="fas fa-${icon} toast-icon"></i>
            <div class="toast-content">
                <span class="toast-message">${message}</span>
            </div>
        `;

        container.appendChild(toast);

        // Force reflow
        void toast.offsetWidth; 

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 400);
        }, 4000);
    }

    // 3. Fonction générique d'envoi de formulaire
    async function sendFormData(e, formType, modalId) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // État de chargement
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        // Récupération des données
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.form_type = formType; // Ajout du type pour le backend

        try {
            const response = await fetch('backend/formulaireUser.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showToast(result.message, 'success');
                form.reset();
                if (modalId) {
                    document.getElementById(modalId).style.display = "none";
                }
            } else {
                showToast('Erreur : ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Erreur:', error);
            showToast('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }

    // 4. Attachement des écouteurs d'événements
    const form = document.getElementById('modal-form');
    if (form) form.addEventListener('submit', (e) => sendFormData(e, 'carte', 'inscription-modal'));

    const formRentree = document.getElementById('rentree-modal-form');
    if (formRentree) formRentree.addEventListener('submit', (e) => sendFormData(e, 'rentree', 'rentree-modal'));

    const formBesoin = document.getElementById('besoin-modal-form');
    if (formBesoin) formBesoin.addEventListener('submit', (e) => sendFormData(e, 'besoin', 'besoin-modal'));

    const formWml = document.getElementById('wml-modal-form');
    if (formWml) formWml.addEventListener('submit', (e) => sendFormData(e, 'wml', 'wml-modal'));

    const formCcna = document.getElementById('ccna-modal-form');
    if (formCcna) formCcna.addEventListener('submit', (e) => sendFormData(e, 'ccna', 'ccna-modal'));

    // Gestion des formulaires sur les pages (non-modaux)
    const homeContactForm = document.getElementById('home-contact-form');
    if (homeContactForm) {
        homeContactForm.addEventListener('submit', (e) => {
            // On injecte le sujet basé sur la formation choisie
            let subjectInput = homeContactForm.querySelector('input[name="subject"]');
            if (!subjectInput) {
                subjectInput = document.createElement('input');
                subjectInput.type = 'hidden';
                subjectInput.name = 'subject';
                homeContactForm.appendChild(subjectInput);
            }
            const formationSelect = homeContactForm.querySelector('select[name="formation"]');
            if (formationSelect && formationSelect.options[formationSelect.selectedIndex]) {
                subjectInput.value = 'Intérêt : ' + formationSelect.options[formationSelect.selectedIndex].text;
            }
            sendFormData(e, 'contact');
        });
    }

    const rentreePageForm = document.getElementById('rentree-page-form');
    if (rentreePageForm) rentreePageForm.addEventListener('submit', (e) => sendFormData(e, 'rentree'));

    const progPageForm = document.getElementById('prog-page-form');
    if (progPageForm) progPageForm.addEventListener('submit', (e) => sendFormData(e, 'programmation'));
});