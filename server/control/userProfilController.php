<?php
require_once "../config/session.php";
require "./model/User.php";

function getCompleteUserProfile(): ?array
{
    $userId = $_SESSION['user_id'] ?? null;

    if (!$userId) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        return null;
    }

    require '../config/db.php'; // Make sure the path is correct
    $user = new User($conn);

    $userData = $user->getUser($userId);
    if (empty($userData)) {
        http_response_code(404);
        echo json_encode(["error" => "User not found"]);
        return null;
    }

    // Get related data
    $orderHistory = $user->getOrderHistory($userId);
    $savedItems = $user->getSavedItems($userId);

    // Combine into one structured response
    return [
        'user' => $userData,
        'order_history' => $orderHistory,
        'saved_items' => $savedItems
    ];
    $conn = null;
}
