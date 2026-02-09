<?php
// backend/admin_api.php
session_start();

// Configuration CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db_connect.php';

// Vérification de l'authentification
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Non autorisé']);
    exit;
}

$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'dashboard_stats':
            // 1. Total Candidatures (Somme des différentes tables d'inscription)
            $sqlTotal = "SELECT 
                (SELECT COUNT(*) FROM grande_rentree_applications) + 
                (SELECT COUNT(*) FROM wml_registrations) + 
                (SELECT COUNT(*) FROM ccna_registrations) + 
                (SELECT COUNT(*) FROM programmation_registrations) as total_candidatures,
                (SELECT COUNT(*) FROM contact_messages) as total_messages,
                (SELECT COUNT(*) FROM specific_needs) as total_needs";
            $counts = $pdo->query($sqlTotal)->fetch();

            // 2. Stats par formulaire
            $formStats = [
                'rentree' => $pdo->query("SELECT COUNT(*) FROM grande_rentree_applications")->fetchColumn(),
                'carte' => $pdo->query("SELECT COUNT(*) FROM custom_training_requests")->fetchColumn(),
                'besoin' => $pdo->query("SELECT COUNT(*) FROM specific_needs")->fetchColumn(),
                'contact' => $pdo->query("SELECT COUNT(*) FROM contact_messages")->fetchColumn()
            ];

            // 3. Activité récente (Les 5 derniers éléments toutes tables confondues)
            $sqlRecent = "
                (SELECT 'contact' as type, full_name, created_at, subject as info FROM contact_messages)
                UNION
                (SELECT 'rentree' as type, full_name, created_at, 'Candidature Rentrée' as info FROM grande_rentree_applications)
                UNION
                (SELECT 'carte' as type, full_name, created_at, CONCAT('Formation: ', domain) as info FROM custom_training_requests)
                ORDER BY created_at DESC LIMIT 5
            ";
            $recent = $pdo->query($sqlRecent)->fetchAll();

            echo json_encode([
                'success' => true,
                'data' => [
                    'counts' => $counts,
                    'formStats' => $formStats,
                    'recent' => $recent
                ]
            ]);
            break;

        case 'get_members':
            $stmt = $pdo->query("SELECT * FROM team_members ORDER BY display_order ASC, created_at DESC");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_forms':
            // Agrégation de tous les formulaires
            $sql = "
                SELECT id, full_name, email, subject, created_at, status, 'contact' as type FROM contact_messages
                UNION ALL
                SELECT id, full_name, email, 'Candidature Grande Rentrée' as subject, created_at, status, 'rentree' as type FROM grande_rentree_applications
                UNION ALL
                SELECT id, full_name, email, CONCAT('Formation: ', domain) as subject, created_at, status, 'carte' as type FROM custom_training_requests
                UNION ALL
                SELECT id, full_name, email, 'Besoin Spécifique' as subject, created_at, status, 'besoin' as type FROM specific_needs
                UNION ALL
                SELECT id, full_name, email, CONCAT('Inscription WML: ', track_interest) as subject, created_at, status, 'wml' as type FROM wml_registrations
                UNION ALL
                SELECT id, full_name, email, 'Inscription CCNA' as subject, created_at, status, 'ccna' as type FROM ccna_registrations
                UNION ALL
                SELECT id, full_name, email, CONCAT('Prog. à la carte: ', IFNULL(technologies, 'General')) as subject, created_at, status, 'programmation' as type FROM programmation_registrations
                ORDER BY created_at DESC
            ";
            $stmt = $pdo->query($sql);
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_registrations':
            $stmt = $pdo->query("SELECT * FROM grande_rentree_applications ORDER BY created_at DESC");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll()]);
            break;

        case 'get_details':
            $type = isset($_GET['type']) ? trim($_GET['type']) : '';
            $id = isset($_GET['id']) ? trim($_GET['id']) : 0;
            
            if (!$id) throw new Exception("ID manquant");

            $data = null;
            $table = '';
            
            // Sélection de la table en fonction du type
            switch ($type) {
                case 'contact': $table = 'contact_messages'; break;
                case 'rentree': $table = 'grande_rentree_applications'; break;
                case 'candidature': $table = 'grande_rentree_applications'; break; // compatibilité
                case 'carte': $table = 'custom_training_requests'; break;
                case 'besoin': $table = 'specific_needs'; break;
                case 'wml': $table = 'wml_registrations'; break;
                case 'ccna': $table = 'ccna_registrations'; break;
                case 'programmation': $table = 'programmation_registrations'; break;
                case 'member': $table = 'team_members'; break;
            }

            if ($table) {
                $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
                $stmt->execute([$id]);
                $data = $stmt->fetch();
            }
            
            if ($data) {
                echo json_encode(['success' => true, 'data' => $data]);
            } else {
                throw new Exception("Enregistrement introuvable (Type: $type, ID: $id)");
            }
            break;

        case 'update_status':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                throw new Exception("Méthode POST requise.");
            }
            $postData = json_decode(file_get_contents('php://input'), true);
            $type = $postData['type'] ?? '';
            $id = $postData['id'] ?? 0;
            $newStatus = $postData['status'] ?? '';

            if (!$id || !$type || !$newStatus) {
                throw new Exception("Données manquantes pour la mise à jour.");
            }

            $table = '';
            switch ($type) {
                case 'contact': $table = 'contact_messages'; break;
                case 'rentree': $table = 'grande_rentree_applications'; break;
                case 'candidature': $table = 'grande_rentree_applications'; break;
                case 'carte': $table = 'custom_training_requests'; break;
                case 'besoin': $table = 'specific_needs'; break;
                case 'wml': $table = 'wml_registrations'; break;
                case 'ccna': $table = 'ccna_registrations'; break;
                case 'programmation': $table = 'programmation_registrations'; break;
                case 'member': $table = 'team_members'; break;
            }

            if ($table) {
                $stmt = $pdo->prepare("UPDATE `$table` SET status = :status, updated_at = NOW() WHERE id = :id");
                $stmt->execute([':status' => $newStatus, ':id' => $id]);
                
                if ($stmt->rowCount() > 0) {
                    // Ici, on pourrait ajouter une logique pour envoyer un email de confirmation
                    echo json_encode(['success' => true, 'message' => 'Statut mis à jour avec succès.']);
                } else {
                    // Si rowCount est 0, soit l'ID n'existe pas, soit le statut est déjà le même.
                    echo json_encode(['success' => true, 'message' => 'Le statut est déjà à jour ou l\'enregistrement est introuvable.']);
                }
            } else {
                throw new Exception("Type de formulaire inconnu pour la mise à jour.");
            }
            break;

        case 'save_member':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Méthode POST requise.");
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception("Données invalides.");
            }

            if (empty($data['full_name']) || empty($data['role'])) {
                throw new Exception("Le nom et le rôle sont obligatoires.");
            }

            // Fonction pour gérer les valeurs nulles ou vides
            $val = function($v) { return ($v === '' || $v === null) ? null : $v; };

            $params = [
                ':name' => $data['full_name'],
                ':role' => $data['role'],
                ':email' => $val($data['email'] ?? ''),
                ':bio' => $val($data['bio'] ?? ''),
                ':photo' => $val($data['photo_url'] ?? ''),
                ':linkedin' => $val($data['linkedin_url'] ?? ''),
                ':github' => $val($data['github_url'] ?? ''),
                ':twitter' => $val($data['twitter_url'] ?? ''),
                ':order' => intval($data['display_order'] ?? 0),
                ':visible' => intval($data['is_visible'] ?? 1)
            ];

            if (!empty($data['id'])) {
                // Mise à jour
                $sql = "UPDATE team_members SET full_name=:name, role=:role, email=:email, bio=:bio, photo_url=:photo, 
                        linkedin_url=:linkedin, github_url=:github, twitter_url=:twitter, display_order=:order, is_visible=:visible 
                        WHERE id=:id";
                $params[':id'] = $data['id'];
                $msg = "Membre mis à jour avec succès.";
            } else {
                // Création
                $sql = "INSERT INTO team_members (full_name, role, email, bio, photo_url, linkedin_url, github_url, twitter_url, display_order, is_visible) 
                        VALUES (:name, :role, :email, :bio, :photo, :linkedin, :github, :twitter, :order, :visible)";
                $msg = "Membre ajouté avec succès.";
            }

            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode(['success' => true, 'message' => $msg]);
            break;

        case 'validate_member':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Méthode POST requise.");
            
            $data = json_decode(file_get_contents('php://input'), true);
            $id = $data['id'] ?? 0;

            if (!$id) throw new Exception("ID manquant.");

            $stmt = $pdo->prepare("UPDATE team_members SET is_visible = 1 WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(['success' => true, 'message' => 'Membre validé et rendu visible sur le site.']);
            break;

        default:
            throw new Exception("Action inconnue");
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>