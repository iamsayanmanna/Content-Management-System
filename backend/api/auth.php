
<?php

require_once __DIR__ . '/../session.php';
requireAuthorSession();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET, OPTIONS');
    sendJson(405, [
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
}

if (empty($_SESSION['author_id'])) {
    sendJson(401, [
        'success' => false,
        'authenticated' => false,
        'message' => 'Please sign in.'
    ]);
}

try {
    $statement = $pdo->prepare(
        'SELECT
    id,
    username,
    email,
    profile_image,
    bio,
    website,
    instagram,
    linkedin,
    github
FROM authors
WHERE id = :id
LIMIT 1'
    );

    $statement->execute([
        'id' => (int) $_SESSION['author_id']
    ]);

    $author = $statement->fetch();

    if (!$author) {
        $_SESSION = [];
        session_destroy();

        sendJson(401, [
            'success' => false,
            'authenticated' => false,
            'message' => 'Author account not found.'
        ]);
    }

    sendJson(200, [
        'success' => true,
        'authenticated' => true,
        'author' => [
    'id' => (int) $author['id'],
    'username' => $author['username'],
    'email' => $author['email'],
    'profile_image' => $author['profile_image'],
    'bio' => $author['bio'],
    'website' => $author['website'],
    'instagram' => $author['instagram'],
    'linkedin' => $author['linkedin'],
    'github' => $author['github']
]
    ]);
} catch (PDOException $exception) {
    error_log('PenSpace auth check error: ' . $exception->getMessage());

    sendJson(500, [
        'success' => false,
        'message' => 'A server error occurred.'
    ]);
}
