<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Debug-Logging (nur für Entwicklung!)
file_put_contents(__DIR__ . '/debug.log', date('Y-m-d H:i:s') . ' ' . print_r($_GET, true), FILE_APPEND);

// Datenbankverbindung herstellen
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

// Einfache Suche (query-Parameter)
if (isset($_GET['query']) && trim($_GET['query']) !== '') {
    $query = '%' . $_GET['query'] . '%';
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

// Erweiterte Suche
$where = [];
$params = [];

// Die Namen müssen zu den Namen im HTML/JS passen!
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
if (!empty($_GET['genre'])) {
    $genres = $_GET['genre'];
    if (!is_array($genres)) $genres = [$genres];
    $genreWhere = [];
    foreach ($genres as $idx => $genre) {
        $param = ":genre$idx";
        $genreWhere[] = "keywords LIKE $param";
        $params[$param] = '%' . $genre . '%';
    }
    $where[] = '(' . implode(' OR ', $genreWhere) . ')';
}

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
    // Keine Suchkriterien gesetzt: leeres Ergebnis zurückgeben
    echo json_encode([]);
    exit;
}
?>
