<?php
// ============================================
// === JSON-Header & Fehlerausgabe aktivieren =
// ============================================

header('Content-Type: application/json');
ini_set('display_errors', 1);       // Fehler anzeigen (nur für Entwicklung)
error_reporting(E_ALL);            // Alle Fehlertypen melden

// ============================================
// === (Optional) Debug-Logging aktivieren ====
// ============================================
// file_put_contents(__DIR__ . '/buch_debug.log', date('Y-m-d H:i:s') . ' ' . print_r($_GET, true), FILE_APPEND);

// ============================================
// === Datenbankverbindung aufbauen ==========
// ============================================

try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=kcs_bibliothek;charset=utf8mb4',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION] // Fehlermodus: Exception
    );
} catch (PDOException $e) {
    echo json_encode([
        'error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $e->getMessage()
    ]);
    exit;
}

// ============================================
// === Buch-ID aus GET-Parameter prüfen =======
// ============================================

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(['error' => 'Keine Buch-ID angegeben.']);
    exit;
}

// ============================================
// === Buch aus Datenbank abfragen ============
// ============================================

try {
    $stmt = $pdo->prepare("SELECT * FROM flat_books WHERE ENTRY_SHARED_ID = ?");
    $stmt->execute([$id]);
    $buch = $stmt->fetch(PDO::FETCH_ASSOC);

    // Kein Buch gefunden?
    if (!$buch) {
        echo json_encode(['error' => 'Buch nicht gefunden']);
        exit;
    }

    // Buchdaten als JSON zurückgeben
    echo json_encode($buch);
    exit;

} catch (PDOException $e) {
    // Fehler beim Abfragen
    echo json_encode([
        'error' => 'Fehler beim Laden des Buchs: ' . $e->getMessage()
    ]);
    exit;
}
?>

