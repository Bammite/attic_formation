<?php
// backend/db_connect.php

// Fonction simple pour charger les variables d'environnement depuis le fichier .env
// Cela évite d'avoir à installer une dépendance composer juste pour ça
function loadEnv($path) {
    if (!file_exists($path)) {
        throw new Exception("Le fichier .env n'existe pas au chemin : $path");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Ignorer les commentaires
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Séparer la clé et la valeur
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            $name = trim($name);
            $value = trim($value);

            // Définir la variable d'environnement
            if (!getenv($name)) {
                putenv(sprintf('%s=%s', $name, $value));
                $_ENV[$name] = $value;
            }
        }
    }
}

try {
    // 1. Chargement de la configuration
    // Chargement du fichier .env
    loadEnv(__DIR__ . '/../equipement/.env');

    // 2. Récupération des variables
    $host = getenv('DB_HOST');
    $dbname = getenv('DB_NAME');
    $user = getenv('DB_USER');
    $password = getenv('DB_PASSWORD');
    $port = getenv('DB_PORT') ?: 3306;
    $charset = getenv('DB_CHARSET') ?: 'utf8mb4';

    // 3. Construction du DSN (Data Source Name)
    $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=$charset";

    // 4. Options PDO pour une meilleure gestion des erreurs et de la sécurité
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lance une exception en cas d'erreur SQL
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,     // Retourne les résultats sous forme de tableau associatif
        PDO::ATTR_EMULATE_PREPARES   => false,                // Utilise les vraies requêtes préparées (sécurité)
    ];

    // 5. Création de l'instance PDO (Connexion effective)
    $pdo = new PDO($dsn, $user, $password, $options);

    // echo "Connexion réussie !"; // Décommenter uniquement pour tester

} catch (PDOException $e) {
    // En cas d'erreur de connexion, on arrête tout et on affiche un message générique (sécurité)
    // error_log($e->getMessage()); // En production, on log l'erreur dans un fichier
    die("Erreur de connexion à la base de données : " . $e->getMessage());
} catch (Exception $e) {
    die("Erreur de configuration : " . $e->getMessage());
}
?>