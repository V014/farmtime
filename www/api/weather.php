<?php
header('Content-Type: application/json; charset=utf-8');

// Get city from query parameter
$city = isset($_GET['city']) ? $_GET['city'] : null;

if (!$city) {
    http_response_code(400);
    echo json_encode(['error' => 'City parameter is required']);
    exit;
}

// API configuration
// Read raw value from env or fallback to project-level config (outside web root)
$raw_env = getenv('OPENWEATHERMAP_API_KEY');
$raw_file = null;
// Prefer reading keys from the project-level config directory (outside web root)
$configPath = dirname(dirname(__DIR__)) . '/config/openweathermap_api_key.ini';
if (file_exists($configPath)) {
    $raw_file = file_get_contents($configPath);
}

$candidate = null;
if ($raw_env !== false && $raw_env !== '') {
    $candidate = $raw_env;
} elseif ($raw_file !== null && $raw_file !== '') {
    $candidate = $raw_file;
}

// Sanitize: remove BOM, trim whitespace/newlines
if ($candidate !== null) {
    // Remove UTF-8 BOM if present
    $candidate = preg_replace('/^\x{FEFF}/u', '', $candidate);
    $candidate = trim($candidate);
    // Remove any whitespace or newlines
    $candidate = preg_replace('/\s+/', '', $candidate);
}

$apiKey = $candidate ?: null;
$url = 'https://api.openweathermap.org/data/2.5/weather';

if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'OpenWeatherMap API key not configured. Set OPENWEATHERMAP_API_KEY environment variable or create api/openweathermap_api_key.ini']);
    exit;
}

// Build the request URL
$requestUrl = $url . '?q=' . urlencode($city) . '&appid=' . $apiKey . '&units=metric';

// Check if curl is available
if (!function_exists('curl_init')) {
    http_response_code(500);
    echo json_encode(['error' => 'curl extension not enabled on server']);
    exit;
}

// Make the request using curl
$ch = curl_init($requestUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'User-Agent: FarmTime-App/1.0'
]);

$result = curl_exec($ch);
$err = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErrno = curl_errno($ch);
curl_close($ch);

if ($err || $curlErrno) {
    http_response_code(500);
    echo json_encode(['error' => 'Request failed: ' . $err, 'curl_errno' => $curlErrno]);
    exit;
}

// Check HTTP status code
if ($httpCode !== 200) {
    http_response_code($httpCode);
    $decoded = json_decode($result, true);
    echo json_encode(['error' => $decoded['message'] ?? 'Weather API returned error']);
    exit;
}

// Return the weather data
echo $result;
?>
