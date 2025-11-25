<?php
header('Content-Type: application/json; charset=utf-8');

// Gemini (Google Generative) configuration.
// Prefer setting these as environment variables (e.g., in Apache vhost or system env):
//   GEMINI_API_KEY and optional GEMINI_MODEL (default: models/gemini-1.0)

// Read raw value from env or fallback to local file if present
$raw_env = getenv('GEMINI_API_KEY');
$raw_file = null;
if (file_exists(__DIR__ . '/api_key.ini')) {
    $raw_file = file_get_contents(__DIR__ . '/api_key.ini');
}

$candidate = null;
if ($raw_env !== false && $raw_env !== '') {
    $candidate = $raw_env;
} elseif ($raw_file !== null && $raw_file !== '') {
    $candidate = $raw_file;
}

// Sanitize: remove BOM, trim whitespace/newlines, strip surrounding quotes
if ($candidate !== null) {
    // Remove UTF-8 BOM if present
    $candidate = preg_replace('/^\x{FEFF}/u', '', $candidate);
    $candidate = trim($candidate);
    // Strip surrounding single or double quotes
    if ((substr($candidate, 0, 1) === '"' && substr($candidate, -1) === '"') || (substr($candidate, 0, 1) === "'" && substr($candidate, -1) === "'")) {
        $candidate = substr($candidate, 1, -1);
    }
    // Remove any leftover whitespace or newlines inside
    $candidate = preg_replace('/\s+/', '', $candidate);
}

$gemini_api_key = $candidate ?: null;
$gemini_model = getenv('GEMINI_MODEL') ?: 'models/gemini-1.0';

if (!$gemini_api_key) {
    http_response_code(500);
    echo json_encode(['error' => 'Gemini API key not configured on server. Set GEMINI_API_KEY as an environment variable or place the key in api/api_key.ini (server-only).']);
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

// Build prompt
$prompt = "You are an expert agricultural advisor. Given the following current weather conditions, recommend 5 suitable plants or crops to plant now (or maintain) for the location. For each plant, give one concise reason why it's suitable and any important caveats (soil type, watering, wind sensitivity). Return the answer as short bullet points (one plant per line) and start with a one-line summary recommendation." .
    "\n\nLocation: $city\nTemperature (°C): " . ($temp !== null ? $temp : 'unknown') .
    "\nHumidity (%): " . ($humidity !== null ? $humidity : 'unknown') .
    "\nWind speed (m/s): " . ($wind !== null ? $wind : 'unknown') .
    "\nWeather description: " . ($description !== null ? $description : 'unknown') .
    "\n\nRespond in plain text, maximum 250 words.";

// Build request body according to Google Generative API simple text generation shape
$postData = [
    'prompt' => [
        'text' => $prompt
    ],
    'temperature' => 0.2,
    'maxOutputTokens' => 500
];

// Endpoint: https://generative.googleapis.com/v1/models/{model}:generate?key=API_KEY
$endpoint = "https://generative.googleapis.com/v1/{$gemini_model}:generate?key={$gemini_api_key}";

$ch = curl_init($endpoint);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
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
// Try several common response shapes from Generative APIs
$advice = null;
if (is_array($decoded)) {
    if (isset($decoded['candidates'][0]['content'])) {
        $advice = $decoded['candidates'][0]['content'];
    } elseif (isset($decoded['candidates'][0]['output'])) {
        $advice = $decoded['candidates'][0]['output'];
    } elseif (isset($decoded['candidates'][0]['text'])) {
        $advice = $decoded['candidates'][0]['text'];
    } elseif (isset($decoded['output'])) {
        // some versions return 'output' directly
        if (is_string($decoded['output'])) {
            $advice = $decoded['output'];
        } elseif (is_array($decoded['output']) && isset($decoded['output'][0]['content'])) {
            $advice = $decoded['output'][0]['content'];
        }
    }
}

if (!$advice) {
    // As a fallback, return raw response for debugging
    http_response_code(500);
    echo json_encode(['error' => 'Invalid response from Gemini API', 'raw' => $result]);
    exit;
}

echo json_encode(['advice' => trim($advice)]);

?>
