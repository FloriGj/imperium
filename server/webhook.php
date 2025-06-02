<?php
require_once '../vendor/autoload.php';
require_once '../config/checkout.config.php';

\Stripe\Stripe::setApiKey($stripeSecretKey);

$endpoint_secret = $stripeWebhookKey;

$payload = @file_get_contents('php://input');
$event = null;

try {
  $event = \Stripe\Event::constructFrom(
    json_decode($payload, true)
  );
} catch(\UnexpectedValueException $e) {
  // Invalid payload
  echo '⚠️  Webhook error while parsing basic request.';
  http_response_code(400);
  exit();
}
if ($endpoint_secret) {
  // Only verify the event if there is an endpoint secret defined
  // Otherwise use the basic decoded event
  $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
  try {
    $event = \Stripe\Webhook::constructEvent(
      $payload, $sig_header, $endpoint_secret
    );
  } catch(\Stripe\Exception\SignatureVerificationException $e) {
    // Invalid signature
    echo '⚠️  Webhook error while validating signature.';
    http_response_code(400);
    exit();
  }
}

// Handle the event
switch ($event->type) {
  case 'checkout.session.completed':
    $session = $event->data->object;
    handleCheckoutCompleted($session);
  default:
    // Unexpected event type
    error_log('Received unknown event type');
}

http_response_code(200);

function handleCheckoutCompleted($session){
    require '../config/db.php'; // assumes $conn is a PDO instance
    
    $jsonSession = json_encode($session);

    $stmt = $conn->prepare('INSERT INTO test(test_text) VALUES (:session)');
    $stmt->bindParam(':session', $jsonSession, PDO::PARAM_STR);
    $stmt->execute();
}