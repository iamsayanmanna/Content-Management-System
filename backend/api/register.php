
<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/database.php';

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

$input = json_decode(file_get_contents('php://input'), true);

if (!is_array($input)) {
    sendJson(400, [
        'success' => false,
        'message' => 'Invalid JSON request.'
    ]);
}

$username = trim($input['username'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (
    $username === '' ||
    $email === '' ||
    !is_string($password) ||
    $password === ''
) {
    sendJson(422, [
        'success' => false,
        'message' => 'Username, email and password are required.'
    ]);
}

if (
    !preg_match('/^[A-Za-z0-9_]{3,50}$/', $username) ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    strlen($password) < 8
) {
    sendJson(422, [
        'success' => false,
        'message' => 'Use a 3–50 character username, valid email and password with at least 8 characters.'
    ]);
}

try {
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $statement = $pdo->prepare(
        'INSERT INTO authors (username, email, password_hash)
         VALUES (:username, :email, :password_hash)'
    );

    $statement->execute([
        'username' => $username,
        'email' => $email,
        'password_hash' => $passwordHash
    ]);

    sendJson(201, [
        'success' => true,
        'message' => 'Author account created successfully.'
    ]);
} catch (PDOException $exception) {
    if ($exception->getCode() === '23000') {
        sendJson(409, [
            'success' => false,
            'message' => 'Username or email is already registered.'
        ]);
    }

    error_log('PenSpace registration error: ' . $exception->getMessage());

    sendJson(500, [
        'success' => false,
        'message' => 'A server error occurred.'
    ]);
}
