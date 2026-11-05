
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

function generateInitials(string $name): string
{
    $parts = preg_split('/\s+/u', trim($name));

    if (count($parts) >= 2) {
        $first = mb_substr($parts[0], 0, 1, 'UTF-8');
        $last = mb_substr(end($parts), 0, 1, 'UTF-8');
        return mb_strtoupper($first . $last, 'UTF-8');
    }

    return mb_strtoupper(
        mb_substr($name, 0, 2, 'UTF-8'),
        'UTF-8'
    );
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

$name = trim($input['name'] ?? '');
$username = trim($input['username'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (
    $name === '' ||
    $username === '' ||
    $email === '' ||
    !is_string($password) ||
    $password === ''
) {
    sendJson(422, [
        'success' => false,
        'message' => 'All fields are required.'
    ]);
}

if (
    mb_strlen($name, 'UTF-8') > 100 ||
    !preg_match('/^[A-Za-z0-9_]{3,50}$/', $username) ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    strlen($password) < 8
) {
    sendJson(422, [
        'success' => false,
        'message' => 'Please check your name, username, email and password.'
    ]);
}

try {
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $initials = generateInitials($name);

    $pdo->beginTransaction();

    // Lock the sequence row to prevent simultaneous registrations
    $sequenceQuery = $pdo->query(
        'SELECT last_number
         FROM author_sequence
         WHERE id = 1
         FOR UPDATE'
    );

    $sequence = $sequenceQuery->fetchColumn();

    if ($sequence === false) {
        throw new RuntimeException('Author sequence is not configured.');
    }

    // Reset numbering if all authors have been deleted
    $authorCount = (int) $pdo
        ->query('SELECT COUNT(*) FROM authors')
        ->fetchColumn();

    $lastNumber = $authorCount === 0 ? 0 : (int) $sequence;

    $nextNumber = $lastNumber + 1;

    $authorId = $initials . '-PS' .
        str_pad((string) $nextNumber, 2, '0', STR_PAD_LEFT);

    $insert = $pdo->prepare(
        'INSERT INTO authors
         (name, author_id, username, email, password_hash)
         VALUES
         (:name, :author_id, :username, :email, :password_hash)'
    );

    $insert->execute([
        'name' => $name,
        'author_id' => $authorId,
        'username' => $username,
        'email' => $email,
        'password_hash' => $passwordHash
    ]);

    $updateSequence = $pdo->prepare(
        'UPDATE author_sequence
         SET last_number = :number
         WHERE id = 1'
    );

    $updateSequence->execute([
        'number' => $nextNumber
    ]);

    $pdo->commit();

    sendJson(201, [
        'success' => true,
        'message' => 'Author account created successfully.',
        'author_id' => $authorId
    ]);

} catch (PDOException $exception) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if ($exception->getCode() === '23000') {
        sendJson(409, [
            'success' => false,
            'message' => 'Username, email or Author ID already exists.'
        ]);
    }

    error_log('PenSpace registration error: ' . $exception->getMessage());

    sendJson(500, [
        'success' => false,
        'message' => 'A server error occurred.'
    ]);

} catch (Throwable $exception) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    error_log('PenSpace registration error: ' . $exception->getMessage());

    sendJson(500, [
        'success' => false,
        'message' => 'A server error occurred.'
    ]);
}
