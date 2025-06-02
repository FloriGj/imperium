<?php
function startSession()
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function destroySession()
{
    session_unset(); // Remove all session variables
    session_destroy(); // Destroy the session
}
