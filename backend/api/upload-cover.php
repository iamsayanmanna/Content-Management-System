
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
        'message' => 'Method not allowed.',
    ]);
}

if (!isset($_FILES['cover_image'])) {
    sendJson(400, [
        'success' => false,
        'message' => 'Please select a cover image.',
    ]);
}

$file = $_FILES['cover_image'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    sendJson(400, [
        'success' => false,
        'message' => 'Image upload failed.',
    ]);
}

$maxSize = 2 * 1024 * 1024;

if ($file['size'] > $maxSize) {
    sendJson(422, [
        'success' => false,
        'message' => 'Cover image must be 2 MB or smaller.',
    ]);
}

if (!is_uploaded_file($file['tmp_name'])) {
    sendJson(400, [
        'success' => false,
        'message' => 'Invalid uploaded file.',
    ]);
}

$imageInfo = @getimagesize($file['tmp_name']);

if ($imageInfo === false) {
    sendJson(422, [
        'success' => false,
        'message' => 'The selected file is not a valid image.',
    ]);
}

$mime = $imageInfo['mime'] ?? '';

$allowedTypes = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
];

if (!isset($allowedTypes[$mime])) {
    sendJson(422, [
        'success' => false,
        'message' => 'Only JPG, PNG and WebP images are allowed.',
    ]);
}

$uploadDir = __DIR__ . '/../uploads/';

if (!is_dir($uploadDir) &&
    !mkdir($uploadDir, 0755, true) &&
    !is_dir($uploadDir)
) {
    sendJson(500, [
        'success' => false,
        'message' => 'Unable to prepare the upload directory.',
    ]);
}

$filename = bin2hex(random_bytes(16))
    . '.'
    . $allowedTypes[$mime];

$destination = $uploadDir . $filename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    sendJson(500, [
        'success' => false,
        'message' => 'Unable to save the cover image.',
    ]);
}

sendJson(201, [
    'success' => true,
    'message' => 'Cover image uploaded successfully.',
    'cover_image' => 'uploads/' . $filename,
]);
