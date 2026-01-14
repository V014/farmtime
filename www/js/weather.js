$(document).ready(function () {
	weatherFn('Pune');

	// Click handler to manually request planting advice for current weather
	$('#get-advice-btn').on('click', function () {
		// Read current displayed weather info (if any) and request advice
		const city = $('#city-name').text();
		const tempText = $('#temperature').text().replace('°C', '');
		const temp = parseFloat(tempText) || null;
		const humidityText = $('#humidity').text().replace('Humidity: ', '').replace('%', '');
		const humidity = parseFloat(humidityText) || null;
		const windText = $('#wind-speed').text().replace('Wind Speed: ', '').replace(' m/s', '');
		const wind = parseFloat(windText) || null;
		const description = $('#description').text();

		getPlantAdvice({
			city,
			temp,
			humidity,
			wind,
			description
		});
	});
});

async function weatherFn(cName) {
	try {
		const res = await fetch(`api/weather.php?city=${encodeURIComponent(cName)}`);
		const data = await res.json();
		if (res.ok) {
			weatherShowFn(data);
		} else {
			alert(data.error || 'City not found. Please try again.');
			console.error('Weather API error:', data);
		}
	} catch (error) {
		console.error('Error fetching weather data:', error);
		alert('Failed to fetch weather data. Check console for details.');
	}
}

function weatherShowFn(data) {
	$('#city-name').text(data.name);
	$('#date').text(moment().
		format('MMMM Do YYYY, h:mm:ss a'));
	$('#temperature').
		html(`${Math.round(data.main.temp)}&deg;C`);
	$('#description').
		text(data.weather[0].description);
	$('#wind-speed').
		html(`Wind Speed: ${data.wind.speed} m/s`);
	$('#humidity').
		html(`Humidity: ${data.main.humidity}%`);
	$('#weather-icon').
		attr('src',
			`icons/clear_sky.png`);
	$('#weather-info').fadeIn();

	// Automatically request plant advice after showing weather
	getPlantAdvice({
		city: data.name,
		temp: data.main.temp,
		humidity: data.main.humidity,
		wind: data.wind.speed,
		description: data.weather[0].description
	});
}

// Send weather data to server-side AI endpoint and render advice
function getPlantAdvice(payload) {
	// Show loading state
	$('#plant-advice').text('Loading planting advice…');
	$('#get-advice-btn').attr('disabled', true).text('Loading…');

	$.ajax({
		url: 'api/ai_advice.php',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		dataType: 'json',
		success: function (res) {
			if (res && res.advice) {
				$('#plant-advice').html(res.advice);
			} else if (res && res.error) {
				$('#plant-advice').text('Error: ' + res.error);
			} else {
				$('#plant-advice').text('No advice returned.');
			}
		},
		error: function (xhr, status, err) {
			console.error('AI advice request failed:', status, err, xhr.responseText);
			$('#plant-advice').text('Failed to get advice. See console for details.');
		},
		complete: function () {
			$('#get-advice-btn').attr('disabled', false).text('Get Planting Advice');
		}
	});
}