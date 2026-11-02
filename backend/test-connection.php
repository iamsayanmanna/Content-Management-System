
<?php

require_once __DIR__ . '/config/database.php';

header('Content-Type: text/plain; charset=utf-8');

try {
    $statement = $pdo->query('SELECT DATABASE() AS database_name');
    $result = $statement->fetch();

    echo "PenSpace database connection successful!\n";
    echo "Connected database: " . $result['database_name'];
} catch (PDOException $exception) {
    error_log('PenSpace connection test failed: ' . $exception->getMessage());

    http_response_code(500);
    echo 'Database test failed. Check the PHP error log.';
}
