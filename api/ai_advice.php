<?php
header('Content-Type: application/json; charset=utf-8');

// Replace this with your OpenAI API key or, preferably, load from env or a secure file
$openai_api_key = 'YOUR_OPENAI_API_KEY_HERE';

if (!$openai_api_key || $openai_api_key === 'YOUR_OPENAI_API_KEY_HERE') {
    http_response_code(500);
    echo json_encode(['error' => 'OpenAI API key not configured on server. Please set $openai_api_key in this file or use environment variables.']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

$city = isset($data['city']) ? $data['city'] : 'unknown location';
$temp = isset($data['temp']) ? $data['temp'] : null;
$humidity = isset($data['humidity']) ? $data['humidity'] : null;
$wind = isset($data['wind']) ? $data['wind'] : null;
$description = isset($data['description']) ? $data['description'] : null;

// Build a concise prompt instructing the model how to respond
$prompt = "You are an expert agricultural advisor. Given the following current weather conditions, recommend 5 suitable plants or crops to plant now (or maintain) for the location. For each plant, give one concise reason why it's suitable and any important caveats (soil type, watering, wind sensitivity). Return the answer as short bullet points (one plant per line) and start with a one-line summary recommendation." .
    "\n\nLocation: $city\nTemperature (°C): " . ($temp !== null ? $temp : 'unknown') .
    "\nHumidity (%): " . ($humidity !== null ? $humidity : 'unknown') .
    "\nWind speed (m/s): " . ($wind !== null ? $wind : 'unknown') .
    "\nWeather description: " . ($description !== null ? $description : 'unknown') .
    "\n\nRespond in plain text, maximum 250 words.";

$postData = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        ['role' => 'system', 'content' => 'You are a helpful assistant that provides short, practical planting recommendations.'],
        ['role' => 'user', 'content' => $prompt]
    ],
    'temperature' => 0.2,
    'max_tokens' => 500
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $openai_api_key
]);

$result = curl_exec($ch);
$err = curl_error($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($err) {
    http_response_code(500);
    echo json_encode(['error' => 'Request error: ' . $err]);
    exit;
}

$decoded = json_decode($result, true);
if (!$decoded || !isset($decoded['choices'][0]['message']['content'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid response from OpenAI', 'raw' => $result]);
    exit;
}

$advice = trim($decoded['choices'][0]['message']['content']);

echo json_encode(['advice' => $advice]);

?>
