
<?php

session_start();
require_once __DIR__ . '/../session.php';

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

$identifier = trim($input['identifier'] ?? '');
$password = $input['password'] ?? '';

if ($identifier === '' || !is_string($password) || $password === '') {
    sendJson(422, [
        'success' => false,
        'message' => 'Username/email and password are required.'
    ]);
}

try {

    $statement = $pdo->prepare(
        'SELECT id, name, author_id, username, email, password_hash
         FROM authors
         WHERE username = :username OR email = :email
         LIMIT 1'
    );

    $statement->execute([
        'username' => $identifier,
        'email' => $identifier
    ]);

    $author = $statement->fetch();

    if (!$author || !password_verify($password, $author['password_hash'])) {
        sendJson(401, [
            'success' => false,
            'message' => 'Invalid username/email or password.'
        ]);
    }

    session_regenerate_id(true);

    $_SESSION['author_id'] = (int) $author['id'];
    $_SESSION['author_username'] = $author['username'];
    $_SESSION['author_name'] = $author['name'];
    $_SESSION['author_code'] = $author['author_id'];
    $_SESSION['last_activity'] = time();

    sendJson(200, [
        'success' => true,
        'message' => 'Login successful.',
        'author' => [
            'id' => (int) $author['id'],
            'name' => $author['name'],
            'author_id' => $author['author_id'],
            'username' => $author['username'],
            'email' => $author['email']
        ]
    ]);

} catch (PDOException $exception) {

    error_log('PenSpace login error: ' . $exception->getMessage());

    sendJson(500, [
        'success' => false,
        'message' => 'A server error occurred.'
    ]);
}
