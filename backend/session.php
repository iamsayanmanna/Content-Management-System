
<?php

function requireAuthorSession(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    $timeout = 900; // 15 minutes of inactivity
    $now = time();

    if (
        !empty($_SESSION['author_id']) &&
        isset($_SESSION['last_activity']) &&
        ($now - (int) $_SESSION['last_activity']) > $timeout
    ) {
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $cookieParams = session_get_cookie_params();

            setcookie(
                session_name(),
                '',
                time() - 42000,
                $cookieParams['path'],
                $cookieParams['domain'],
                $cookieParams['secure'],
                $cookieParams['httponly']
            );
        }

        session_destroy();

        http_response_code(401);
        header('Content-Type: application/json; charset=utf-8');

        echo json_encode([
            'success' => false,
            'authenticated' => false,
            'message' => 'Your session has expired. Please sign in again.'
        ]);

        exit;
    }

    if (!empty($_SESSION['author_id'])) {
        $_SESSION['last_activity'] = $now;
    }
}
