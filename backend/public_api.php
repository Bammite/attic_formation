<?php
// backend/public_api.php

// Configuration CORS et Type de contenu
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once 'db_connect.php';

$action = $_GET['action'] ?? '';

try {
    if ($action === 'get_team') {
        // Récupérer uniquement les membres marqués comme visibles, triés par ordre d'affichage
        $stmt = $pdo->query("SELECT * FROM team_members WHERE is_visible = 1 ORDER BY display_order ASC, created_at DESC");
        $members = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'data' => $members]);
    } else {
        // Autres endpoints publics futurs
        echo json_encode(['success' => false, 'message' => 'Action inconnue']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>