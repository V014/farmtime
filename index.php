<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="style.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap">
	<title>Farm Time</title>
</head>

<body>
	<div class="container">
		<div class="weather-card">
			<h1 style="color: green;">
				Farm Time
			</h1>
			<h3>
				Weather App & Advisor
			</h3>
			<input type="text" id="city-input" placeholder="Enter city name">
			<button id="city-input-btn">Get Weather</button>
			<div id="weather-info" class="animate__animated animate__fadeIn">
				<h3 id="city-name"></h3>
				<img id="weather-icon" src="" alt="Weather Icon">
				<p id="temperature"></p>
				<p id="description"></p>
				<p id="wind-speed"></p>
				<p id="humidity"></p>
				<!-- Planting advice UI: button + container -->
				<div id="plant-advice-container" style="margin-top:12px;">
					<button id="get-advice-btn">Get Planting Advice</button>
					<div id="plant-advice" style="margin-top:8px; white-space:pre-wrap;"></div>
				</div>
				<p id="date"></p>
			</div>
		</div>
	</div>

	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<script src="https://momentjs.com/downloads/moment.min.js"></script>
	<script src="script.js"></script>
	<script>
		// JavaScript logic here
		$('#city-input-btn').on('click', function() {
			let cityName = $('#city-input').val();
			weatherFn(cityName);
		});
	</script>
</body>
</html>