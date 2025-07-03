<?php
header('Content-Type: application/json');

ini_set ('display_errors', 1);
error_reporting(E_ALL);




try {
    $pdo = new PDO('mysql:host=localhost;dbname=kcs_bibliothek', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Verbindung zur Datenbank fehlgeschlagen: ' . $e->getMessage()]);
    exit;
}


// Einfache Suche
if (isset($_GET['query'])){
    $query = '%' . $_GET['query'] . '%';
    $sql = 'SELECT * FROM flat_books
        WHERE author LIKE :query 
        OR title LIKE :query 
        OR isbn LIKE :query
        OR publisher LIKE :query 
        OR keywords LIKE :query ';
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['query' => $query]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
    exit;
}

// Erweiterte Suche
$where = [];
$params = [];

if (!empty($_GET['author'])) {
    $where[] = "author LIKE :author";
    $params[':author'] = '%' . $_GET['author'] . '%';
}
// title-Suche
if (!empty($_GET['title'])) {
    $where[] = "title LIKE :title";
    $params[':title'] = '%' . $_GET['title'] . '%';
}
// ISBN-Suche
if (!empty($_GET['isbn'])) {
    $where[] = "isbn LIKE :isbn";
    $params[':isbn'] = '%' . $_GET['isbn'] . '%';
}
// publisher-Suche
if (!empty($_GET['publisher'])) {
    $where[] = "publisher LIKE :publisher";
    $params[':publisher'] = '%' . $_GET['publisher'] . '%';
}
// Genere-Suche
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

$sql = 'SELECT * FROM flat_books';
if ($where) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
} else {
    // Keine Bedingungen gesetzt: Keine Suche durchführen!
    echo json_encode([]);
    exit;
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($result); 
?>