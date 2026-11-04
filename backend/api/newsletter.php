
<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit;
}

require_once __DIR__ . '/../config/database.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = trim($data['email'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO newsletter_subscribers (email)
        VALUES (:email)
        ON DUPLICATE KEY UPDATE status = 'active'
    ");

    $stmt->execute([
        ':email' => strtolower($email)
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Thank you for subscribing to PenSpace!'
    ]);

} catch (PDOException $exception) {
    error_log('Newsletter subscription error: ' . $exception->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Something went wrong. Please try again later.'
    ]);
}
