<?php
// backend/formulaireUser.php

// Configuration des en-têtes pour l'API JSON et CORS
// Permet au JS d'appeler ce fichier sans erreur de cross-origin
header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gestion de la requête pré-vol (OPTIONS) pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Inclusion de la connexion à la base de données
require_once 'db_connect.php';

// Fonction utilitaire pour envoyer la réponse JSON et arrêter le script
function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Méthode non autorisée. Seul POST est accepté.');
}

// Récupération des données
// On tente de lire le corps de la requête (JSON) car fetch() envoie souvent du JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Si ce n'est pas du JSON valide ou si c'est vide, on regarde $_POST (FormData classique)
if (json_last_error() !== JSON_ERROR_NONE || empty($data)) {
    $data = $_POST;
}

// Vérification de la présence du type de formulaire
if (!isset($data['form_type']) || empty($data['form_type'])) {
    sendResponse(false, 'Type de formulaire non spécifié (form_type manquant).');
}

$type = $data['form_type'];

try {
    // Switch pour gérer les différents types de formulaires
    switch ($type) {
        
        // 1. Formulaire de Contact Général
        case 'contact':
            // Champs attendus : name, email, message, subject (optionnel)
            if (empty($data['name']) || empty($data['email'])) {
                throw new Exception("Veuillez remplir tous les champs obligatoires (Nom, Email).");
            }

            $stmt = $pdo->prepare("INSERT INTO contact_messages (full_name, email, subject, message) VALUES (:name, :email, :subject, :message)");
            $stmt->execute([
                ':name' => $data['name'],
                ':email' => $data['email'],
                ':subject' => $data['subject'] ?? 'Contact Site Web',
                ':message' => $data['message']
            ]);
            
            sendResponse(true, 'Votre message a été envoyé avec succès !');
            break;

        // 2. Formation à la Carte (Modal)
        case 'carte':
            // Champs : domain, name, email, phone, mode, source
            if (empty($data['domain']) || empty($data['name']) || empty($data['email'])) {
                throw new Exception("Champs obligatoires manquants.");
            }

            $stmt = $pdo->prepare("INSERT INTO custom_training_requests (domain, full_name, email, phone, preference_mode, source) VALUES (:domain, :name, :email, :phone, :mode, :source)");
            $stmt->execute([
                ':domain' => $data['domain'],
                ':name' => $data['name'],
                ':email' => $data['email'],
                ':phone' => $data['phone'] ?? null,
                ':mode' => $data['mode'] ?? 'online',
                ':source' => $data['source'] ?? null
            ]);

            sendResponse(true, 'Votre demande de formation à la carte a été enregistrée.');
            break;

        // 3. Grande Rentrée
        case 'rentree':
            // Champs : name, email, phone, motivation, funding
            if (empty($data['name']) || empty($data['email']) || empty($data['phone'])) {
                throw new Exception("Champs obligatoires manquants.");
            }

            $stmt = $pdo->prepare("INSERT INTO grande_rentree_applications (full_name, email, phone, motivation, funding_type) VALUES (:name, :email, :phone, :motivation, :funding)");
            $stmt->execute([
                ':name' => $data['name'],
                ':email' => $data['email'],
                ':phone' => $data['phone'],
                ':motivation' => $data['motivation'] ?? null,
                ':funding' => $data['funding'] ?? null
            ]);

            sendResponse(true, 'Candidature pour la Grande Rentrée reçue avec succès ! Un conseiller vous contactera.');
            break;

        // 4. Besoin Spécifique
        case 'besoin':
            // Champs : name, email, description
            if (empty($data['name']) || empty($data['email']) || empty($data['description'])) {
                throw new Exception("Champs obligatoires manquants.");
            }

            $stmt = $pdo->prepare("INSERT INTO specific_needs (full_name, email, description) VALUES (:name, :email, :description)");
            $stmt->execute([
                ':name' => $data['name'],
                ':email' => $data['email'],
                ':description' => $data['description']
            ]);

            sendResponse(true, 'Votre besoin spécifique a été transmis à notre équipe pédagogique.');
            break;

        // 5. Web Mobile Logiciel (WML)
        case 'wml':
            // Champs : name, email, phone, track, level
            if (empty($data['name']) || empty($data['email']) || empty($data['phone'])) {
                throw new Exception("Champs obligatoires manquants.");
            }

            $stmt = $pdo->prepare("INSERT INTO wml_registrations (full_name, email, phone, track_interest, current_level) VALUES (:name, :email, :phone, :track, :level)");
            $stmt->execute([
                ':name' => $data['name'],
                ':email' => $data['email'],
                ':phone' => $data['phone'],
                ':track' => $data['track'] ?? 'all',
                ':level' => $data['level'] ?? 'beginner'
            ]);

            sendResponse(true, 'Inscription au cursus Web & Mobile confirmée !');
            break;

        // 6. CCNA
        case 'ccna':
            // Champs : name, email, phone, status
            if (empty($data['name']) || empty($data['email']) || empty($data['phone'])) {
                throw new Exception("Champs obligatoires manquants.");
            }

            $stmt = $pdo->prepare("INSERT INTO ccna_registrations (full_name, email, phone, current_status) VALUES (:name, :email, :phone, :status)");
            $stmt->execute([
                ':name' => $data['name'],
                ':email' => $data['email'],
                ':phone' => $data['phone'],
                ':status' => $data['status'] ?? 'student'
            ]);

            sendResponse(true, 'Inscription CCNA enregistrée. Préparez-vous à certifier !');
            break;

        // 7. Programmation à la carte (Page dédiée)
        case 'programmation':
            // Champs : name, email, technologies, objective, formula
            if (empty($data['name']) || empty($data['email'])) {
                throw new Exception("Champs obligatoires manquants.");
            }

            $stmt = $pdo->prepare("INSERT INTO programmation_registrations (full_name, email, technologies, objective, formula) VALUES (:name, :email, :tech, :obj, :formula)");
            $stmt->execute([
                ':name' => $data['name'],
                ':email' => $data['email'],
                ':tech' => $data['technologies'] ?? null,
                ':obj' => $data['objective'] ?? null,
                ':formula' => $data['formula'] ?? null
            ]);

            sendResponse(true, 'Votre demande de programme a été reçue.');
            break;

        // 8. Rejoindre l'équipe (Candidature spontanée membre)
        case 'join_team':
            if (empty($data['full_name']) || empty($data['role']) || empty($data['email'])) {
                throw new Exception("Nom, Rôle et Email sont obligatoires.");
            }

            // Insertion avec is_visible = 0 (En attente de validation)
            $stmt = $pdo->prepare("INSERT INTO team_members (full_name, role, email, bio, photo_url, linkedin_url, github_url, twitter_url, is_visible) VALUES (:name, :role, :email, :bio, :photo, :linkedin, :github, :twitter, 0)");
            
            $stmt->execute([
                ':name' => $data['full_name'],
                ':role' => $data['role'],
                ':email' => $data['email'],
                ':bio' => $data['bio'] ?? null,
                ':photo' => $data['photo_url'] ?? null,
                ':linkedin' => $data['linkedin_url'] ?? null,
                ':github' => $data['github_url'] ?? null,
                ':twitter' => $data['twitter_url'] ?? null
            ]);

            sendResponse(true, 'Candidature enregistrée.');
            break;

        default:
            sendResponse(false, 'Type de formulaire non reconnu.');
    }

} catch (PDOException $e) {
    // En production, on log l'erreur mais on affiche un message générique pour la sécurité
    error_log("Erreur SQL : " . $e->getMessage());
    sendResponse(false, 'Une erreur est survenue lors de l\'enregistrement en base de données.');
} catch (Exception $e) {
    sendResponse(false, 'Erreur : ' . $e->getMessage());
}
?>