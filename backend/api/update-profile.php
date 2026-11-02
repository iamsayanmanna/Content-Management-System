
<?php

require_once __DIR__ . '/../session.php';
requireAuthorSession();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function sendJson(int $status, array $data): void
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}

require_once __DIR__ . '/../config/database.php';

$authorId = $_SESSION['author_id'] ?? null;

if (!$authorId) {
    sendJson(401, [
        'success' => false,
        'message' => 'Please log in again.'
    ]);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!is_array($input)) {
    sendJson(400, [
        'success' => false,
        'message' => 'Invalid request data.'
    ]);
}

$username = trim($input['username'] ?? '');
$email = trim($input['email'] ?? '');

if ($username === '' || strlen($username) > 50) {
    sendJson(422, [
        'success' => false,
        'message' => 'Username is required and must be at most 50 characters.'
    ]);
}

if ($email === '' || strlen($email) > 150 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJson(422, [
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);
}

try {
    $statement = $pdo->prepare(
        'UPDATE authors
         SET username = :username, email = :email
         WHERE id = :id'
    );

    $statement->execute([
        ':username' => $username,
        ':email' => $email,
        ':id' => $authorId
    ]);

    sendJson(200, [
        'success' => true,
        'message' => 'Profile updated successfully.'
    ]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        sendJson(409, [
            'success' => false,
            'message' => 'That username or email is already in use.'
        ]);
    }

    error_log('Profile update failed: ' . $e->getMessage());

    sendJson(500, [
        'success' => false,
        'message' => 'Unable to update profile right now.'
    ]);
}
