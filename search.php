<?php
// ==============================================
// === RESPONSE ALS JSON & FEHLERAUSGABE AN ===
// ==============================================

header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ==============================================
// === (Optional) DEBUG-LOGGING FÜR ENTWICKLER ===
// ==============================================
// file_put_contents(__DIR__ . '/debug.log', date('Y-m-d H:i:s') . ' ' . print_r($_GET, true), FILE_APPEND);

// ==============================================
// === DATENBANKVERBINDUNG HERSTELLEN =========
// ==============================================

try {
    $pdo = new PDO(
        'mysql:host=localhost;dbname=kcs_bibliothek;charset=utf8mb4',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION] // Fehler als Exception werfen
    );
} catch (PDOException $e) {
    echo json_encode(['error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $e->getMessage()]);
    exit;
}

// ==============================================
// === EINFACHE SUCHE (via query=...) ==========
// ==============================================

if (isset($_GET['query']) && trim($_GET['query']) !== '') {
    $query = '%' . $_GET['query'] . '%';

    // Sucht in mehreren Spalten gleichzeitig
    $sql = 'SELECT * FROM flat_books
            WHERE author LIKE :query
               OR title LIKE :query
               OR isbn LIKE :query
               OR publisher LIKE :query
               OR keywords LIKE :query';

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['query' => $query]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($result);
        exit;
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Fehler bei der Suche: ' . $e->getMessage()]);
        exit;
    }
}

// ==============================================
// === ERWEITERTE SUCHE =========================
// ==============================================

$where = [];   // WHERE-Bedingungen
$params = [];  // Parameter für das Prepared Statement

// === Parameter prüfen & WHERE-Klauseln aufbauen ===
// Hinweis: Die Namen müssen mit HTML/JS-Feldern übereinstimmen!

if (!empty($_GET['author'])) {
    $where[] = "author LIKE :author";
    $params[':author'] = '%' . $_GET['author'] . '%';
}

if (!empty($_GET['title'])) {
    $where[] = "title LIKE :title";
    $params[':title'] = '%' . $_GET['title'] . '%';
}

if (!empty($_GET['isbn'])) {
    $where[] = "isbn LIKE :isbn";
    $params[':isbn'] = '%' . $_GET['isbn'] . '%';
}

if (!empty($_GET['publisher'])) {
    $where[] = "publisher LIKE :publisher";
    $params[':publisher'] = '%' . $_GET['publisher'] . '%';
}

// === Genres: Mehrfachauswahl behandeln ===

if (!empty($_GET['genre'])) {
    $genres = $_GET['genre'];

    // Falls nur ein einzelner Wert übergeben wurde
    if (!is_array($genres)) $genres = [$genres];

    $genreWhere = [];

    foreach ($genres as $idx => $genre) {
        $param = ":genre$idx";
        $genreWhere[] = "keywords LIKE $param";
        $params[$param] = '%' . $genre . '%';
    }

    // Mehrere Genrebedingungen mit OR verknüpfen
    $where[] = '(' . implode(' OR ', $genreWhere) . ')';
}

// ==============================================
// === SQL-Anfrage ausführen, falls Filter da ===
// ==============================================

if ($where) {
    $sql = 'SELECT * FROM flat_books WHERE ' . implode(' AND ', $where);

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($result);
        exit;
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Fehler bei der erweiterten Suche: ' . $e->getMessage()]);
        exit;
    }
} else {
    // Keine Filterkriterien übergeben → leeres Ergebnis
    echo json_encode([]);
    exit;
}
?>
