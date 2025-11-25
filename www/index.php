<!DOCTYPE html>
<!--
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *; img-src 'self' data: content:;">
	<meta name="format-detection" content="telephone=no">
	<meta name="msapplication-tap-highlight" content="no">
	<meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover">
	<meta name="color-scheme" content="light dark">
	<link rel="stylesheet" href="css/style.css">
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
	<script src="js/script.js"></script>
	<script>
		// JavaScript logic here
		$('#city-input-btn').on('click', function() {
			let cityName = $('#city-input').val();
			weatherFn(cityName);
		});
	</script>
</body>
</html>