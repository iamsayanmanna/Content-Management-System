
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
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST, OPTIONS');
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
        'message' => 'Invalid JSON request.'
    ]);
}

$currentPassword = $input['currentPassword'] ?? '';
$newPassword = $input['newPassword'] ?? '';

if (
    !is_string($currentPassword) ||
    !is_string($newPassword) ||
    $currentPassword === '' ||
    $newPassword === ''
) {
    sendJson(422, [
        'success' => false,
        'message' => 'Current password and new password are required.'
    ]);
}

if (strlen($newPassword) < 8) {
    sendJson(422, [
        'success' => false,
        'message' => 'New password must be at least 8 characters long.'
    ]);
}

try {
    $statement = $pdo->prepare(
        'SELECT password_hash FROM authors WHERE id = :id LIMIT 1'
    );

    $statement->execute(['id' => $authorId]);
    $author = $statement->fetch();

    if (!$author || !password_verify($currentPassword, $author['password_hash'])) {
        sendJson(422, [
            'success' => false,
            'message' => 'Current password is incorrect.'
        ]);
    }

    if (password_verify($newPassword, $author['password_hash'])) {
        sendJson(422, [
            'success' => false,
            'message' => 'New password must be different from your current password.'
        ]);
    }

    $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);

    $update = $pdo->prepare(
        'UPDATE authors SET password_hash = :password_hash WHERE id = :id'
    );

    $update->execute([
        'password_hash' => $newPasswordHash,
        'id' => $authorId
    ]);

    sendJson(200, [
        'success' => true,
        'message' => 'Password changed successfully.'
    ]);
} catch (PDOException $exception) {
    error_log('PenSpace change-password error: ' . $exception->getMessage());

    sendJson(500, [
        'success' => false,
        'message' => 'Unable to change password right now.'
    ]);
}
