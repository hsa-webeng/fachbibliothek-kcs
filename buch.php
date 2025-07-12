<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Debug-Log (optional, für Entwicklung)
file_put_contents(__DIR__ . '/buch_debug.log', date('Y-m-d H:i:s') . ' ' . print_r($_GET, true), FILE_APPEND);

try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=kcs_bibliothek;charset=utf8mb4',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    echo json_encode(['error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $e->getMessage()]);
    exit;
}

$id = $_GET['id'] ?? null;
if(!$id){
    echo json_encode(['error' => 'Keine Buch-ID angegeben.']);
    exit;
}

try {
    $stmt= $pdo->prepare("SELECT * FROM flat_books WHERE ENTRY_SHARED_ID = ?");
    $stmt->execute([$id]);
    $buch = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$buch){
        echo json_encode(['error' => 'Buch nicht gefunden']);
        exit;
    }

    echo json_encode($buch);
    exit;
} catch (PDOException $e) {
    echo json_encode(['error' => 'Fehler beim Laden des Buchs: ' . $e->getMessage()]);
    exit;
}
?>
