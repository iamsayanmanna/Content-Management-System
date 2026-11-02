
<?php
require_once __DIR__ . '/../session.php';
requireAuthorSession();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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

$method = $_SERVER['REQUEST_METHOD'];

try {
   
if ($method === 'GET') {
    if (isset($_GET['mine']) && $_GET['mine'] === '1') {
        if (empty($_SESSION['author_id'])) {
            sendJson(401, [
                'success' => false,
                'message' => 'Please sign in to view your posts.',
            ]);
        }

        $statement = $pdo->prepare(
    "SELECT id, author_id, title, excerpt, content, status,
            category, created_at, updated_at, cover_image
     FROM posts
     WHERE author_id = :author_id
     ORDER BY created_at DESC"
);

        $statement->execute([
            'author_id' => (int) $_SESSION['author_id'],
        ]);
    } else {
       $statement = $pdo->query(
    "SELECT
        p.id,
        p.title,
        p.excerpt,
        p.content,
        p.status,
        p.created_at,
        p.updated_at,
        p.cover_image,
p.category,
a.username AS author_name
     FROM posts p
     INNER JOIN authors a ON a.id = p.author_id
     WHERE p.status = 'published'
     ORDER BY p.created_at DESC"
);
    }

   
$posts = $statement->fetchAll();

foreach ($posts as &$post) {
    $tagStatement = $pdo->prepare(
        "SELECT tag FROM post_tags WHERE post_id = :post_id ORDER BY tag ASC"
    );

    $tagStatement->execute([
        'post_id' => $post['id'],
    ]);

    $post['tags'] = $tagStatement->fetchAll(PDO::FETCH_COLUMN);
}

unset($post);

sendJson(200, [
    'success' => true,
    'posts' => $posts,
]);

}


    
if ($method === 'PUT') {
    if (empty($_SESSION['author_id'])) {
        sendJson(401, [
            'success' => false,
            'message' => 'Please sign in before editing.',
        ]);
    }

    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        sendJson(400, [
            'success' => false,
            'message' => 'Invalid JSON request.',
        ]);
    }

    $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);
    $title = trim($input['title'] ?? '');
    $excerpt = trim($input['excerpt'] ?? '');
    $content = trim($input['content'] ?? '');
    $coverImage = $input['cover_image'] ?? null;
    $category = trim($input['category'] ?? '');

    $tags = $input['tags'] ?? [];

if (!is_array($tags)) {
    sendJson(422, [
        'success' => false,
        'message' => 'Tags must be provided as a list.',
    ]);
}

$tags = array_values(array_unique(array_filter(
    array_map(
        static fn($tag) => is_string($tag) ? trim($tag) : '',
        $tags
    ),
    static fn($tag) => $tag !== '' && mb_strlen($tag) <= 50
)));

if (count($tags) > 10) {
    sendJson(422, [
        'success' => false,
        'message' => 'You can add a maximum of 10 tags.',
    ]);
}

    
$status = $input['status'] ?? 'published';

if (!in_array($status, ['draft', 'published'], true)) {
    sendJson(422, [
        'success' => false,
        'message' => 'Invalid post status.',
    ]);
}


    

    if (!$id || $title === '' || $excerpt === '' || $content === '') {
        sendJson(422, [
            'success' => false,
            'message' => 'A valid post ID, title, excerpt and content are required.',
        ]);
    }

    if (mb_strlen($title) > 200 || mb_strlen($excerpt) > 500) {
        sendJson(422, [
            'success' => false,
            'message' => 'Title or excerpt exceeds the allowed length.',
        ]);
    }

    $statement = $pdo->prepare(
       

"UPDATE posts
 SET title = :title,
     excerpt = :excerpt,
     content = :content,
     status = :status,
     category = :category,
     cover_image = COALESCE(:cover_image, cover_image),
     updated_at = CURRENT_TIMESTAMP
 WHERE id = :id AND author_id = :author_id"


    );

    $statement->execute([
        'title' => $title,
        'excerpt' => $excerpt,
        'content' => $content,
        'status' => $status,
        'cover_image' => $coverImage,
        'id' => $id,
        'author_id' => (int) $_SESSION['author_id'],
        'category' => $category !== '' ? $category : null,
    ]);

    



    if ($statement->rowCount() === 0) {
        $check = $pdo->prepare(
            'SELECT id FROM posts WHERE id = :id AND author_id = :author_id'
        );
        $check->execute([
            'id' => $id,
            'author_id' => (int) $_SESSION['author_id'],
        ]);

        if (!$check->fetch()) {
            sendJson(404, [
                'success' => false,
                'message' => 'Post not found or you do not have permission to edit it.',
            ]);
        }
    }





    $pdo->beginTransaction();

try {
    $deleteTags = $pdo->prepare(
        "DELETE FROM post_tags WHERE post_id = :post_id"
    );

    $deleteTags->execute(['post_id' => $id]);

    if (!empty($tags)) {
        $tagStatement = $pdo->prepare(
            "INSERT INTO post_tags (post_id, tag)
             VALUES (:post_id, :tag)"
        );

        foreach ($tags as $tag) {
            $tagStatement->execute([
                'post_id' => $id,
                'tag' => $tag,
            ]);
        }
    }

    $pdo->commit();
} catch (PDOException $exception) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    throw $exception;
}






    sendJson(200, [
        'success' => true,
        'message' => 'Post updated successfully.',
        'post' => [
            'id' => $id,
            'title' => $title,
            'excerpt' => $excerpt,
            'content' => $content,
            'cover_image' => $coverImage,
        ],
    ]);
}


if ($method === 'DELETE') {
    if (empty($_SESSION['author_id'])) {
        sendJson(401, [
            'success' => false,
            'message' => 'Please sign in before deleting.',
        ]);
    }

    $input = json_decode(file_get_contents('php://input'), true);

    if (!is_array($input)) {
        sendJson(400, [
            'success' => false,
            'message' => 'Invalid JSON request.',
        ]);
    }

    $id = filter_var($input['id'] ?? null, FILTER_VALIDATE_INT);

    if (!$id) {
        sendJson(422, [
            'success' => false,
            'message' => 'A valid post ID is required.',
        ]);
    }

    $statement = $pdo->prepare(
        'DELETE FROM posts WHERE id = :id AND author_id = :author_id'
    );

    $statement->execute([
        'id' => $id,
        'author_id' => (int) $_SESSION['author_id'],
    ]);

    if ($statement->rowCount() === 0) {
        sendJson(404, [
            'success' => false,
            'message' => 'Post not found or you do not have permission to delete it.',
        ]);
    }

    sendJson(200, [
        'success' => true,
        'message' => 'Post deleted successfully.',
        'id' => $id,
    ]);
}



    if ($method === 'POST') {
        $input = json_decode(
            file_get_contents('php://input'),
            true
        );

        if (!is_array($input)) {
            sendJson(400, [
                'success' => false,
                'message' => 'Invalid JSON request.',
            ]);
        }

        $title = trim($input['title'] ?? '');
        $excerpt = trim($input['excerpt'] ?? '');
        $content = trim($input['content'] ?? '');
        $coverImage = $input['cover_image'] ?? null;
        $category = trim($input['category'] ?? '');

        
$tags = $input['tags'] ?? [];

if (!is_array($tags)) {
    sendJson(422, [
        'success' => false,
        'message' => 'Tags must be provided as a list.',
    ]);
}

$tags = array_values(array_unique(array_filter(
    array_map(
        static fn($tag) => is_string($tag) ? trim($tag) : '',
        $tags
    ),
    static fn($tag) => $tag !== '' && mb_strlen($tag) <= 50
)));

if (count($tags) > 10) {
    sendJson(422, [
        'success' => false,
        'message' => 'You can add a maximum of 10 tags.',
    ]);
}


        
$status = $input['status'] ?? 'published';

if (!in_array($status, ['draft', 'published'], true)) {
    sendJson(422, [
        'success' => false,
        'message' => 'Invalid post status.',
    ]);
}


        if ($title === '' || $excerpt === '' || $content === '') {
            sendJson(422, [
                'success' => false,
                'message' => 'Title, excerpt and content are required.',
            ]);
        }

        if (mb_strlen($title) > 200 || mb_strlen($excerpt) > 500) {
            sendJson(422, [
                'success' => false,
                'message' => 'Title or excerpt exceeds the allowed length.',
            ]);
        }

        
if (empty($_SESSION['author_id'])) {
    sendJson(401, [
        'success' => false,
        'message' => 'Please sign in before publishing.',
    ]);
}

$authorId = (int) $_SESSION['author_id'];



$statement = $pdo->prepare(
    "INSERT INTO posts
        (author_id, title, excerpt, content, status, cover_image, category)
     VALUES
        (:author_id, :title, :excerpt, :content, :status, :cover_image, :category)"
);



$statement->execute([
    'author_id' => $authorId,
    'title' => $title,
    'excerpt' => $excerpt,
    'content' => $content,
    'status' => $status,
    'cover_image' => $coverImage,
    'category' => $category !== '' ? $category : null,
]);

$postId = (int) $pdo->lastInsertId();


if (!empty($tags)) {
    $tagStatement = $pdo->prepare(
        "INSERT INTO post_tags (post_id, tag)
         VALUES (:post_id, :tag)"
    );

    foreach ($tags as $tag) {
        $tagStatement->execute([
            'post_id' => $postId,
            'tag' => $tag,
        ]);
    }
}



sendJson(201, [
    'success' => true,
    'message' => $status === 'draft'
    ? 'Draft saved successfully.'
    : 'Post published successfully.',
    'post' => [
        'id' => $postId,
        'author_id' => $authorId,
        'title' => $title,
        'excerpt' => $excerpt,
        'content' => $content,
        'status' => $status,
        'cover_image' => $coverImage,
    ],
]);

    }

    header('Allow: GET, POST, PUT, DELETE, OPTIONS');

    sendJson(405, [
        'success' => false,
        'message' => 'Method not allowed.',
    ]);
} catch (PDOException $exception) {
    error_log('PenSpace posts API error: ' . $exception->getMessage());

    sendJson(500, [
        'success' => false,
        'message' => 'A server error occurred.',
    ]);
}
