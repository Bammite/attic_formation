<?php
// backend/formulaireAuth.php

// Démarrage de la session pour gérer l'état connecté
session_start();

// Configuration CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db_connect.php';

function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Récupération des données (JSON ou POST)
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE || empty($data)) {
    $data = $_POST;
}

// On regarde aussi dans $_GET pour des actions simples comme logout ou check_session
$action = $data['action'] ?? $_GET['action'] ?? null;

if (!$action) {
    sendResponse(false, 'Action non spécifiée.');
}

try {
    if ($action === 'register') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Méthode POST requise.");

        // Validation des champs
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            throw new Exception("Tous les champs obligatoires doivent être remplis.");
        }
        
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Format d'email invalide.");
        }
        
        if (strlen($data['password']) < 8) {
            throw new Exception("Le mot de passe doit contenir au moins 8 caractères.");
        }

        // Vérification si l'email existe déjà
        $stmt = $pdo->prepare("SELECT id FROM admins WHERE email = :email");
        $stmt->execute([':email' => $data['email']]);
        if ($stmt->fetch()) {
            throw new Exception("Cet email est déjà utilisé.");
        }

        // Hashage du mot de passe
        $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

        // Insertion
        // On insère dans la table admins avec un privilège par défaut à 0
        $stmt = $pdo->prepare("INSERT INTO admins (username, email, password_hash, privilege) VALUES (:name, :email, :pass, 0)");
        $stmt->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':pass' => $passwordHash
        ]);

        sendResponse(true, 'Inscription réussie ! Votre compte est en attente de validation par un administrateur.');

    } elseif ($action === 'login') {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Méthode POST requise.");

        if (empty($data['email']) || empty($data['password'])) {
            throw new Exception("Email et mot de passe requis.");
        }
        
        // On récupère aussi le rôle
        $stmt = $pdo->prepare("SELECT id, username, password_hash, privilege, role FROM admins WHERE email = :email");
        $stmt->execute([':email' => $data['email']]);
        $user = $stmt->fetch();

        if ($user && password_verify($data['password'], $user['password_hash'])) {
            // Vérification du privilège
            if ($user['privilege'] < 1) {
                throw new Exception("Votre compte n'a pas encore été validé par un administrateur.");
            }
            
            // Mise en session
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_name'] = $user['username'];
            $_SESSION['admin_role'] = $user['role'];

            // Mise à jour last_login
            $update = $pdo->prepare("UPDATE admins SET last_login = NOW() WHERE id = :id");
            $update->execute([':id' => $user['id']]);

            sendResponse(true, 'Connexion réussie !', [
                'redirect' => '../admin/index.html',
                'user' => ['name' => $user['username']]
            ]);
        } else {
            throw new Exception("Email ou mot de passe incorrect.");
        }

    } elseif ($action === 'logout') {
        session_destroy();
        sendResponse(true, 'Déconnexion réussie.');

    } elseif ($action === 'check_session') {
        if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
            sendResponse(true, 'Session active', [
                'user' => [
                    'name' => $_SESSION['admin_name'],
                    'role' => $_SESSION['admin_role']
                ]
            ]);
        } else {
            sendResponse(false, 'Non connecté');
        }

    } else {
        throw new Exception("Action inconnue.");
    }

} catch (PDOException $e) {
    error_log("Erreur SQL Auth : " . $e->getMessage());
    sendResponse(false, 'Une erreur technique est survenue.');
} catch (Exception $e) {
    sendResponse(false, $e->getMessage());
}
?>