<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$passwordInput = $data['password'];

// APIリクエスト
$apiUrl = 'https://hackingdemo.microcms.io/api/v1/loginform';
$apiKey = 'bVsOaxRIkuEeMt1kYgEyt6ogJfkpwmIKlkv2';

$options = [
    'http' => [
        'header' => "X-MICROCMS-API-KEY: $apiKey",
        'method' => 'GET',
    ],
];

$context = stream_context_create($options);
$response = file_get_contents($apiUrl, false, $context);
$data = json_decode($response, true);

if ($passwordInput === $data['password']) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
