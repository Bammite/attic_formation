document.addEventListener('DOMContentLoaded', function() {
    // 1. Vérification de sécurité (Session)
    fetch('../backend/formulaireAuth.php?action=check_session')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                // Pas connecté -> Redirection vers login
                window.location.href = '../auth/auth.html';
            } else {
                // Connecté -> Mise à jour de l'interface
                const adminNameEl = document.querySelector('.admin-name');
                const adminRoleEl = document.querySelector('.admin-role');
                if(adminNameEl && data.data.user.name) adminNameEl.textContent = data.data.user.name;
                if(adminRoleEl && data.data.user.role) adminRoleEl.textContent = data.data.user.role;

                // CHARGEMENT DES DONNÉES RÉELLES
                loadDashboardData();
                loadMembers();
                loadForms();
                loadRegistrations();
            }
        })
        .catch(() => window.location.href = '../auth/auth.html');

    // Navigation between sections
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            // section to show
            const sectionId = item.dataset.section;

            //si c'est un lien externe
            if(item.classList.contains('external-link')) {
                const urlMap = {
                    'website': '../index.html',
                    'help': 'https://helpdesk.example.com'
                };
                const targetUrl = urlMap[sectionId];
                if(targetUrl) {
                    window.open(targetUrl, '_blank');
                }
                return;
            }
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
            
            // Update page title
            const titles = {
                'dashboard': 'Tableau de bord',
                'members': 'Gestion de l\'équipe',
                'forms': 'Réponses aux formulaires',
                'registrations': 'Liste des inscriptions',
                'password': 'Modifier le mot de passe'
            };
            pageTitle.textContent = titles[sectionId];
            
            // Close mobile sidebar if open
            if (window.innerWidth <= 992) {
                document.querySelector('.admin-sidebar').classList.remove('active');
            }
        });
    });
    
    // Modal functionality
    const addMemberBtn = document.getElementById('add-member-btn');
    const memberModal = document.getElementById('member-modal');
    const detailsModal = document.getElementById('details-modal');
    const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-close-btn');
    
    // Open Add Member Modal
    if(addMemberBtn) {
        addMemberBtn.addEventListener('click', () => {
            console.log("Opening Add Member Modal");
            document.getElementById('member-modal-title').textContent = "Ajouter un membre";
            document.getElementById('member-form').reset();
            document.getElementById('member-id').value = ''; // Reset ID for new entry
            document.getElementById('member-photo-url').value = ''; // Reset hidden photo URL
            document.getElementById('photo-preview').style.display = 'none';
            document.getElementById('photo-preview').style.backgroundImage = '';
            memberModal.classList.add('active');
        });
    }
    
    // Preview photo on file select
    const memberPhotoInput = document.getElementById('member-photo-upload');
    if(memberPhotoInput) {
        memberPhotoInput.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('photo-preview');
                    preview.style.backgroundImage = `url('${e.target.result}')`;
                    preview.style.display = 'block';
                }
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // Open Edit Member Modal (Delegation)
    document.addEventListener('click', (e) => {

        const editBtn = e.target.closest('.edit-member-btn');
        if (editBtn) {
            const id = editBtn.dataset.id;
            document.getElementById('member-modal-title').textContent = "Modifier le profil";
            
            // Fetch real data
            fetch(`../backend/admin_api.php?action=get_details&type=member&id=${id}`)
                .then(res => res.json())
                .then(res => {
                    if(res.success) {
                        const data = res.data;
                        document.getElementById('member-id').value = data.id;
                        document.getElementById('member-name').value = data.full_name;
                        document.getElementById('member-role').value = data.role;
                        document.getElementById('member-email').value = data.email || '';
                        document.getElementById('member-bio').value = data.bio || '';
                        document.getElementById('member-linkedin').value = data.linkedin_url || '';
                        document.getElementById('member-github').value = data.github_url || '';
                        document.getElementById('member-twitter').value = data.twitter_url || '';
                        document.getElementById('member-order').value = data.display_order || 0;
                        document.getElementById('member-visible').value = data.is_visible;
                        document.getElementById('member-photo-url').value = data.photo_url || '';

                        // Preview photo
                        const preview = document.getElementById('photo-preview');
                        if (data.photo_url) {
                            // On gère le chemin relatif si nécessaire
                            const url = data.photo_url.startsWith('http') ? data.photo_url : `../${data.photo_url}`;
                            preview.style.backgroundImage = `url('${url}')`;
                            preview.style.display = 'block';
                        } else {
                            preview.style.display = 'none';
                            preview.style.backgroundImage = '';
                        }

                        memberModal.classList.add('active');
                    } else {
                        alert("Erreur lors de la récupération des données.");
                    }
                })
                .catch(err => console.error(err));
        }
    });

    // Open Details Modal (Delegation)
    document.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.view-details-btn');
        if (viewBtn) {
            const type = viewBtn.dataset.type;
            const id = viewBtn.dataset.id;
            const contentDiv = document.getElementById('details-content');
            const title = document.getElementById('details-title');
            contentDiv.dataset.id = id;
            contentDiv.dataset.type = type;
            
            contentDiv.innerHTML = '<div style="text-align:center; padding:20px;">Chargement...</div>';
            detailsModal.classList.add('active');

            fetch(`../backend/admin_api.php?action=get_details&type=${type}&id=${id}`)
                .then(res => res.json())
                .then(res => {
                    if(res.success) {
                        const data = res.data;
                        let html = '';
                        title.textContent = "Détails de la demande";

                        // Champs communs
                        html += `<div class="detail-row"><div class="detail-label">Nom</div><div class="detail-value">${data.full_name}</div></div>`;
                        html += `<div class="detail-row"><div class="detail-label">Email</div><div class="detail-value">${data.email}</div></div>`;
                        if(data.phone) html += `<div class="detail-row"><div class="detail-label">Téléphone</div><div class="detail-value">${data.phone}</div></div>`;

                        // Champs spécifiques
                        if (type === 'contact') {
                            html += `<div class="detail-row"><div class="detail-label">Sujet</div><div class="detail-value">${data.subject || '-'}</div></div>`;
                            html += `<div class="detail-row"><div class="detail-label">Message</div><div class="detail-value">${data.message}</div></div>`;
                        } else if (type === 'rentree' || type === 'candidature') {
                            html += `<div class="detail-row"><div class="detail-label">Financement</div><div class="detail-value">${data.funding_type || '-'}</div></div>`;
                            html += `<div class="detail-row"><div class="detail-label">Motivation</div><div class="detail-value">${data.motivation || '-'}</div></div>`;
                        } else if (type === 'carte') {
                            html += `<div class="detail-row"><div class="detail-label">Domaine</div><div class="detail-value">${data.domain}</div></div>`;
                            html += `<div class="detail-row"><div class="detail-label">Mode</div><div class="detail-value">${data.preference_mode}</div></div>`;
                            html += `<div class="detail-row"><div class="detail-label">Source</div><div class="detail-value">${data.source || '-'}</div></div>`;
                        } else if (type === 'besoin') {
                            html += `<div class="detail-row"><div class="detail-label">Description</div><div class="detail-value">${data.description}</div></div>`;
                        } else if (type === 'wml') {
                            html += `<div class="detail-row"><div class="detail-label">Parcours</div><div class="detail-value">${data.track_interest}</div></div>`;
                            html += `<div class="detail-row"><div class="detail-label">Niveau</div><div class="detail-value">${data.current_level}</div></div>`;
                        } else if (type === 'ccna') {
                            html += `<div class="detail-row"><div class="detail-label">Statut</div><div class="detail-value">${data.current_status}</div></div>`;
                        } else if (type === 'programmation') {
                            html += `<div class="detail-row"><div class="detail-label">Technologies</div><div class="detail-value">${data.technologies}</div></div>`;
                            html += `<div class="detail-row"><div class="detail-label">Objectif</div><div class="detail-value">${data.objective}</div></div>`;
                            html += `<div class="detail-row"><div class="detail-label">Formule</div><div class="detail-value">${data.formula}</div></div>`;
                        }

                        // Date et Statut
                        html += `<div class="detail-row"><div class="detail-label">Date</div><div class="detail-value">${new Date(data.created_at).toLocaleString('fr-FR')}</div></div>`;
                        html += `<div class="detail-row"><div class="detail-label">Statut</div><div class="detail-value"><span class="status-badge ${data.status === 'new' || data.status === 'pending' ? 'status-pending' : 'status-completed'}">${data.status}</span></div></div>`;

                        contentDiv.innerHTML = html;

                        // Ajout des boutons d'action
                        const actionsContainer = document.getElementById('details-modal-actions');
                        actionsContainer.innerHTML = `
                            <button type="button" class="btn btn-secondary modal-close-btn">Fermer</button>
                            <button type="button" class="btn btn-danger" data-action="reject">Rejeter</button>
                            <button type="button" class="btn btn-success" data-action="validate">Valider</button>`;
                    } else {
                        contentDiv.innerHTML = '<div style="color:red; text-align:center;">Erreur de chargement</div>';
                    }
                });
        }
    });

    // Close Modals
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            memberModal.classList.remove('active');
            detailsModal.classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === memberModal) memberModal.classList.remove('active');
        if (e.target === detailsModal) detailsModal.classList.remove('active');
    });

    // Gestion des actions sur les soumissions (Valider/Rejeter)
    document.getElementById('details-modal-actions').addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const contentDiv = document.getElementById('details-content');
        const id = contentDiv.dataset.id;
        const type = contentDiv.dataset.type;

        if (confirm(`Êtes-vous sûr de vouloir "${action}" cette demande ?`)) {
            handleSubmissionAction(action, type, id);
        }
    });

    // Gestion de la validation des membres
    document.addEventListener('click', (e) => {
        const validateBtn = e.target.closest('.validate-member-btn');
        if (validateBtn) {
            const id = validateBtn.dataset.id;
            if (confirm("Voulez-vous valider ce membre et le rendre visible sur le site ?")) {
                validateMember(id);
            }
        }
    });






    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if(mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && 
            sidebar && !sidebar.contains(e.target) && 
            mobileMenuToggle && !mobileMenuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
    
    // Password strength indicator
    const newPasswordInput = document.getElementById('new-password');
    const strengthBar = document.getElementById('strength-bar');
    
    if(newPasswordInput) {
        newPasswordInput.addEventListener('input', () => {
            const password = newPasswordInput.value;
            let strength = 0;
            
            // Check password strength
            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            // Update strength bar
            strengthBar.className = 'strength-bar';
            if (strength === 1) {
                strengthBar.classList.add('strength-weak');
            } else if (strength === 2 || strength === 3) {
                strengthBar.classList.add('strength-medium');
            } else if (strength === 4) {
                strengthBar.classList.add('strength-strong');
            }
        });
    }
    
    // Form submissions
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mot de passe modifié avec succès !');
            passwordForm.reset();
            if(strengthBar) strengthBar.className = 'strength-bar';
        });
    }

    const memberForm = document.getElementById('member-form');
    if (memberForm) {
        memberForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleMemberSubmit(memberForm);
        });
    }

    async function handleMemberSubmit(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Traitement...";

        try {
            // Vérification des éléments avant accès
            const nameInput = document.getElementById('member-name');
            const roleInput = document.getElementById('member-role');
            
            if (!nameInput || !roleInput) {
                throw new Error("Champs obligatoires introuvables dans le DOM.");
            }

            // 1. Gestion de l'upload d'image (si présente)
            const fileInput = document.getElementById('member-photo-upload');
            const photoUrlInput = document.getElementById('member-photo-url');
            let photoUrl = photoUrlInput ? photoUrlInput.value : '';

            if (fileInput && fileInput.files.length > 0) {
                const formData = new FormData();
                formData.append('file_upload', fileInput.files[0]);
                formData.append('directory', 'avatars'); // Sous-dossier autorisé

                const uploadRes = await fetch('../backend/upload_handler.php', {
                    method: 'POST',
                    body: formData
                });
                
                if (!uploadRes.ok) throw new Error(`Erreur HTTP Upload: ${uploadRes.status}`);

                const uploadData = await uploadRes.json();

                if (!uploadData.success) throw new Error(uploadData.message);
                photoUrl = uploadData.data.filePath;
            }

            // 2. Envoi des données du membre
            const memberData = {
                full_name: nameInput.value,
                role: roleInput.value,
                email: document.getElementById('member-email')?.value || '',
                bio: document.getElementById('member-bio')?.value || '',
                photo_url: photoUrl,
                linkedin_url: document.getElementById('member-linkedin')?.value || '',
                github_url: document.getElementById('member-github')?.value || '',
                twitter_url: document.getElementById('member-twitter')?.value || '',
                display_order: document.getElementById('member-order')?.value || 0,
                is_visible: document.getElementById('member-visible')?.value || 1,
                id: document.getElementById('member-id')?.value || ''
            };

            console.log("Envoi des données :", memberData);

            const apiRes = await fetch('../backend/admin_api.php?action=save_member', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(memberData)
            });
            
            if (!apiRes.ok) throw new Error(`Erreur HTTP API: ${apiRes.status}`);
            
            const apiData = await apiRes.json();

            if (apiData.success) {
                alert(apiData.message);
                form.reset();
                document.getElementById('member-modal').classList.remove('active');
                loadMembers(); // Recharger la liste
            } else {
                throw new Error(apiData.message);
            }

        } catch (error) {
            console.error(error);
            alert("Erreur : " + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    // Cancel password change
    const cancelPasswordBtn = document.getElementById('cancel-password');
    if(cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', () => {
            document.querySelector('#password-form').reset();
            if(strengthBar) strengthBar.className = 'strength-bar';
            
            // Go back to dashboard
            document.querySelector('.nav-item[data-section="dashboard"]').click();
        });
    }
    
    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                fetch('../backend/formulaireAuth.php?action=logout')
                    .then(() => {
                        window.location.href = '../auth/auth.html';
                    });
            }
        });
    }
    
    // Responsive sidebar
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && sidebar) {
            sidebar.classList.remove('active');
        }
    });

    // --- FONCTIONS DE CHARGEMENT DES DONNÉES ---

    function loadDashboardData() {
        fetch('../backend/admin_api.php?action=dashboard_stats')
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    // Stats principales
                    const stats = data.data.counts;
                    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = stats.total_candidatures;
                    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = stats.total_messages;
                    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = stats.total_needs;

                    // Stats formulaires
                    const formStats = data.data.formStats;
                    const statItems = document.querySelectorAll('.form-stat-count');
                    if(statItems.length >= 4) {
                        statItems[0].textContent = formStats.rentree;
                        statItems[1].textContent = formStats.carte;
                        statItems[2].textContent = formStats.besoin;
                        statItems[3].textContent = formStats.contact;
                    }

                    // Activité récente
                    const recentList = document.querySelector('.recent-list');
                    recentList.innerHTML = '';
                    if(data.data.recent.length === 0) {
                        recentList.innerHTML = '<li class="recent-item"><div class="item-content" style="text-align: center; color: var(--text-secondary); padding: 20px;">Aucune nouvelle demande.</div></li>';
                    } else {
                        data.data.recent.forEach(item => {
                            const date = new Date(item.created_at).toLocaleDateString('fr-FR');
                            const li = document.createElement('li');
                            li.className = 'recent-item';
                            li.innerHTML = `
                                <div class="item-icon ${item.type === 'contact' ? 'bg-purple' : 'bg-blue'}" style="background: ${item.type === 'contact' ? '#e0e7ff; color: #4f46e5' : '#dbeafe; color: #2563eb'}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                    <i class="fas ${item.type === 'contact' ? 'fa-envelope' : 'fa-user-graduate'}"></i>
                                </div>
                                <div class="item-content">
                                    <div class="item-title" style="font-weight: 600;">${item.full_name}</div>
                                    <div class="item-subtitle" style="font-size: 0.85rem; color: #6b7280;">${item.info}</div>
                                </div>
                                <div class="item-time" style="font-size: 0.85rem; color: #9ca3af;">${date}</div>
                            `;
                            recentList.appendChild(li);
                        });
                    }
                }
            });
    }

    function loadMembers() {
        fetch('../backend/admin_api.php?action=get_members')
            .then(res => res.json())
            .then(res => {
                if(res.success) {
                    const container = document.querySelector('#members .data-table');
                    const header = container.querySelector('.table-header');
                    container.innerHTML = '';
                    container.appendChild(header);
                    
                    res.data.forEach(member => {
                        // Détermination du statut et des boutons
                        const isVisible = member.is_visible == 1;
                        const statusBadge = isVisible 
                            ? '<span class="status-badge status-completed">Actif</span>' 
                            : '<span class="status-badge status-pending">En attente</span>';
                        
                        const validateBtn = !isVisible 
                            ? `<button class="btn-icon btn-success validate-member-btn" data-id="${member.id}" title="Valider"><i class="fas fa-check"></i></button>` 
                            : '';

                        const row = document.createElement('div');
                        row.className = 'table-row';
                        row.innerHTML = `
                            <div>${member.full_name}</div>
                            <div><span class="status-badge status-active">${member.role}</span></div>
                            <div>${member.email || '-'}</div>
                            <div>${new Date(member.created_at).toLocaleDateString('fr-FR')}</div>
                            <div>${statusBadge}</div>
                            <div class="action-buttons">
                                ${validateBtn}
                                <button class="btn-icon btn-edit edit-member-btn" data-id="${member.id}" title="Modifier"><i class="fas fa-edit"></i></button>
                                <button class="btn-icon btn-delete" title="Supprimer"><i class="fas fa-trash"></i></button>
                            </div>
                        `;
                        container.appendChild(row);
                    });
                }
            });
    }

    function loadForms() {
        fetch('../backend/admin_api.php?action=get_forms')
            .then(res => res.json())
            .then(res => {
                if(res.success) {
                    const container = document.querySelector('#forms .data-table');
                    const header = container.querySelector('.table-header');
                    container.innerHTML = '';
                    container.appendChild(header);
                    
                    res.data.forEach(msg => {
                        const row = document.createElement('div');
                        row.className = 'table-row';
                        row.innerHTML = `
                            <div>${msg.email}</div>
                            <div>${msg.subject || 'Sans sujet'}</div>
                            <div>${new Date(msg.created_at).toLocaleDateString('fr-FR')}</div>
                            <div><span class="status-badge ${msg.status === 'new' || msg.status === 'pending' ? 'status-pending' : 'status-completed'}">${msg.status}</span></div>
                            <div class="action-buttons">
                                <button class="btn-icon btn-view view-details-btn" data-type="${msg.type}" data-id="${msg.id}" title="Voir détails"><i class="fas fa-eye"></i></button>
                            </div>
                        `;
                        container.appendChild(row);
                    });
                }
            });
    }

    function loadRegistrations() {
        fetch('../backend/admin_api.php?action=get_registrations')
            .then(res => res.json())
            .then(res => {
                if(res.success) {
                    const container = document.querySelector('#registrations .data-table');
                    const header = container.querySelector('.table-header');
                    container.innerHTML = '';
                    container.appendChild(header);
                    
                    res.data.forEach(reg => {
                        const row = document.createElement('div');
                        row.className = 'table-row';
                        row.innerHTML = `
                            <div>${reg.full_name}</div>
                            <div>${reg.email}</div>
                            <div>${reg.funding_type || '-'}</div>
                            <div>${new Date(reg.created_at).toLocaleDateString('fr-FR')}</div>
                            <div><span class="status-badge ${reg.status === 'pending' ? 'status-pending' : 'status-active'}">${reg.status}</span></div>
                            <div class="action-buttons">
                                <button class="btn-icon btn-view view-details-btn" data-type="candidature" data-id="${reg.id}" title="Voir dossier"><i class="fas fa-eye"></i></button>
                                <button class="btn-icon btn-edit"><i class="fas fa-check"></i></button>
                            </div>
                        `;
                        container.appendChild(row);
                    });
                }
            });
    }

    function handleSubmissionAction(action, type, id) {
        let newStatus = '';

        // Traduire l'action générique en statut spécifique à la table
        if (action === 'validate') {
            switch(type) {
                case 'contact': newStatus = 'replied'; break;
                case 'rentree': newStatus = 'accepted'; break;
                case 'programmation': newStatus = 'enrolled'; break;
                default: newStatus = 'contacted'; break;
            }
        } else if (action === 'reject') {
            switch(type) {
                case 'contact': newStatus = 'archived'; break;
                case 'rentree': newStatus = 'rejected'; break;
                default: newStatus = 'closed'; break;
            }
        }

        if (!newStatus) {
            alert("Action non reconnue pour ce type de formulaire.");
            return;
        }

        fetch('../backend/admin_api.php?action=update_status', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ type, id, status: newStatus })
        })
        .then(res => res.json())
        .then(res => {
            alert(res.message);
            if (res.success) {
                document.getElementById('details-modal').classList.remove('active');
                loadForms(); // Rafraîchir la liste des formulaires
            }
        })
        .catch(err => alert("Erreur de communication avec le serveur."));
    }

    function validateMember(id) {
        fetch('../backend/admin_api.php?action=validate_member', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: id })
        })
        .then(res => res.json())
        .then(res => {
            alert(res.message);
            if(res.success) loadMembers();
        })
        .catch(err => alert("Erreur lors de la validation."));
    }
});
