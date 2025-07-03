<?php
header('Content-Type: application/json');

try {
    $pdo = new PDO('mysql:host=localhost;dbname=kcs_bibliothek', 'root', '',[
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die(json_encode(['error' => $e->getMessage()]));
}

$id = $_GET['id'] ?? null;
if(!$id){
    echo json_encode(['error' => 'Keine Buch-ID angegeben.']);
    exit;
}


$stmt= $pdo->prepare("SELECT * FROM flat_books WHERE ENTRY_SHARED_ID= ?");
$stmt->execute([$id]);
$buch = $stmt->fetch(PDO::FETCH_ASSOC);

if(!$buch){
    echo json_encode(['error' => 'Buch nicht gefunden']);
    exit;
}

echo json_encode($buch);
?>