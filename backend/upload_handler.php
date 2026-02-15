<?php
// backend/upload_handler.php

/**
 * Gère l'upload d'un fichier de manière sécurisée.
 *
 * @param string $inputName Le nom du champ input de type 'file' dans le formulaire.
 * @param string $targetDir Le répertoire de destination sur le serveur (chemin complet).
 * @param array $allowedMimeTypes Un tableau des types MIME autorisés (ex: ['image/jpeg', 'application/pdf']).
 * @param int $maxFileSize La taille maximale autorisée en octets.
 * @return string Le chemin web-accessible du fichier uploadé.
 * @throws RuntimeException En cas d'erreur (fichier non trouvé, taille/type invalide, etc.).
 */
function handleUpload(string $inputName, string $targetDir, array $allowedMimeTypes, int $maxFileSize): string {
    // 1. Vérifier si le fichier a bien été envoyé et s'il n'y a pas d'erreur
    if (!isset($_FILES[$inputName]['error']) || is_array($_FILES[$inputName]['error'])) {
        throw new RuntimeException('Paramètres de fichier invalides.');
    }

    switch ($_FILES[$inputName]['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('Aucun fichier n\'a été envoyé.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('La taille du fichier dépasse la limite autorisée.');
        default:
            throw new RuntimeException('Erreur inconnue lors de l\'upload.');
    }

    // 2. Vérifier la taille du fichier
    if ($_FILES[$inputName]['size'] > $maxFileSize) {
        $maxSizeMB = round($maxFileSize / 1024 / 1024, 2);
        throw new RuntimeException("Le fichier est trop volumineux (max: {$maxSizeMB} Mo).");
    }

    // 3. Vérifier le type MIME du fichier pour plus de sécurité
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($_FILES[$inputName]['tmp_name']);
    if (in_array($mimeType, $allowedMimeTypes, true) === false) {
        throw new RuntimeException('Format de fichier non autorisé.');
    }

    // 4. Générer un nom de fichier unique et sécurisé
    // Utilise le hash du contenu du fichier pour éviter les doublons et les conflits de noms.
    $extension = pathinfo($_FILES[$inputName]['name'], PATHINFO_EXTENSION);
    $safeFilename = sha1_file($_FILES[$inputName]['tmp_name']) . '.' . strtolower($extension);

    // 5. Créer le dossier de destination s'il n'existe pas
    if (!is_dir($targetDir)) {
        if (!mkdir($targetDir, 0775, true)) {
            throw new RuntimeException('Échec de la création du dossier de destination.');
        }
    }

    // Résolution du chemin absolu pour éviter les ".." dans le chemin final
    $realTargetDir = realpath($targetDir);
    if ($realTargetDir === false) {
        throw new RuntimeException('Impossible de résoudre le chemin du dossier.');
    }

    $targetPath = $realTargetDir . DIRECTORY_SEPARATOR . $safeFilename;

    // 6. Déplacer le fichier du répertoire temporaire vers la destination finale
    if (!move_uploaded_file($_FILES[$inputName]['tmp_name'], $targetPath)) {
        throw new RuntimeException('Échec du déplacement du fichier uploadé.');
    }

    // 7. Retourner le chemin web-accessible (relatif à la racine du site)
    // On utilise realpath sur DOCUMENT_ROOT pour une comparaison fiable
    $docRoot = realpath($_SERVER['DOCUMENT_ROOT']) ?: $_SERVER['DOCUMENT_ROOT'];
    
    // On retire la racine du serveur pour obtenir le chemin web
    $webPath = str_replace($docRoot, '', $targetPath);
    
    // Normalisation des slashes (Windows -> Unix) et ajout du slash initial si manquant
    $webPath = str_replace(DIRECTORY_SEPARATOR, '/', $webPath);
    if (substr($webPath, 0, 1) !== '/') {
        $webPath = '/' . $webPath;
    }
    
    return $webPath;
}


/* --- POINT D'ENTRÉE DE L'API --- */

// Configuration des en-têtes pour l'API JSON et CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Fonction utilitaire pour la réponse
function sendUploadResponse($success, $message, $data = null) {
    http_response_code($success ? 200 : 400);
    echo json_encode(['success' => $success, 'message' => $message, 'data' => $data]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendUploadResponse(false, 'Méthode non autorisée. Seul POST est accepté.');
}

try {
    // --- Configuration de l'upload ---
    
    // Le répertoire de base pour tous les uploads, situé à la racine du projet.
    $baseUploadDir = __DIR__ . '/../uploads';

    // On peut spécifier un sous-dossier via le formulaire (ex: 'avatars', 'documents')
    // Pour la sécurité, on utilise une liste blanche de dossiers autorisés.
    $allowedSubDirs = ['avatars', 'courses', 'documents', 'general'];
    $subDir = $_POST['directory'] ?? 'general';
    if (!in_array($subDir, $allowedSubDirs, true)) {
        throw new RuntimeException('Répertoire de destination non valide.');
    }
    $targetDir = $baseUploadDir . DIRECTORY_SEPARATOR . $subDir;

    // Taille max: 10 Mo
    $maxSize = 10 * 1024 * 1024; 

    // Types de fichiers autorisés
    $allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf',
        'video/mp4', 'video/webm'
    ];

    // Le nom du champ <input type="file" name="file_upload"> dans votre formulaire HTML.
    $fileInputName = 'file_upload';

    // Appel de la fonction de traitement
    $filePath = handleUpload($fileInputName, $targetDir, $allowedTypes, $maxSize);

    // Succès
    sendUploadResponse(true, 'Fichier uploadé avec succès.', ['filePath' => $filePath]);

} catch (RuntimeException $e) {
    // Erreur "attendue" (ex: mauvais format, fichier trop gros)
    sendUploadResponse(false, $e->getMessage());
} catch (Exception $e) {
    // Erreur système imprévue
    error_log('Upload Error: ' . $e->getMessage()); // Log pour le debug
    sendUploadResponse(false, 'Une erreur serveur est survenue. Veuillez réessayer.');
}
?>