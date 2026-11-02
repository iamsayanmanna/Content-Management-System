
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

if (
    !isset($_FILES['profile_image']) ||
    $_FILES['profile_image']['error'] !== UPLOAD_ERR_OK
) {
    sendJson(400, [
        'success' => false,
        'message' => 'Please select a valid image.'
    ]);
}

$file = $_FILES['profile_image'];

$maxSize = 5 * 1024 * 1024;

if ($file['size'] > $maxSize) {
    sendJson(422, [
        'success' => false,
        'message' => 'Image must be smaller than 5 MB.'
    ]);
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);

$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp'
];

if (!isset($allowedTypes[$mimeType])) {
    sendJson(422, [
        'success' => false,
        'message' => 'Only JPG, PNG and WEBP images are allowed.'
    ]);
}

$imageInfo = getimagesize($file['tmp_name']);

if ($imageInfo === false) {
    sendJson(422, [
        'success' => false,
        'message' => 'Invalid image file.'
    ]);
}

$uploadDirectory = __DIR__ . '/../uploads/profile-images/';

if (
    !is_dir($uploadDirectory) &&
    !mkdir($uploadDirectory, 0755, true)
) {
    sendJson(500, [
        'success' => false,
        'message' => 'Unable to create upload directory.'
    ]);
}

$extension = $allowedTypes[$mimeType];
$fileName = bin2hex(random_bytes(16)) . '.' . $extension;

$destination = $uploadDirectory . $fileName;

try {
    $statement = $pdo->prepare(
        'SELECT profile_image FROM authors WHERE id = :id LIMIT 1'
    );

    $statement->execute([':id' => $authorId]);
    $author = $statement->fetch();

    if (!$author) {
        sendJson(404, [
            'success' => false,
            'message' => 'Author account not found.'
        ]);
    }

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        sendJson(500, [
            'success' => false,
            'message' => 'Unable to upload image.'
        ]);
    }

    $imagePath = 'uploads/profile-images/' . $fileName;

    $update = $pdo->prepare(
        'UPDATE authors SET profile_image = :image WHERE id = :id'
    );

    $update->execute([
        ':image' => $imagePath,
        ':id' => $authorId
    ]);

    // Delete the previous image only if it belongs to our profile folder.
    $oldImage = $author['profile_image'] ?? '';

    if (
        $oldImage &&
        str_starts_with($oldImage, 'uploads/profile-images/')
    ) {
        $oldFile = realpath(__DIR__ . '/../' . $oldImage);
        $safeDirectory = realpath($uploadDirectory);

        if (
            $oldFile &&
            $safeDirectory &&
            str_starts_with(
                $oldFile,
                $safeDirectory . DIRECTORY_SEPARATOR
            ) &&
            is_file($oldFile)
        ) {
            unlink($oldFile);
        }
    }

    sendJson(200, [
        'success' => true,
        'message' => 'Profile photo updated successfully.',
        'profile_image' => $imagePath
    ]);

} catch (PDOException $e) {
    if (isset($destination) && is_file($destination)) {
        unlink($destination);
    }

    error_log('Profile image upload failed: ' . $e->getMessage());

    sendJson(500, [
        'success' => false,
        'message' => 'Unable to update profile photo.'
    ]);
}
