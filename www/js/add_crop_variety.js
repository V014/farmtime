// add crop.js
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Attach the click event to your button
    if (document.getElementById('add_crop_variety')) {
        document.getElementById('add_crop_variety').addEventListener('click', addCropVariety);
    }
}

function addCropVariety() {
    const crop_name = document.getElementById('crop_name').value;
    const crop_variety = document.getElementById('crop_variety').value;
    const crop_availability = (document.getElementById('crop_availability').value);
    const pH_min = parseFloat(document.getElementById('pH_min').value);
    const pH_max = parseFloat(document.getElementById('pH_max').value);
    const temp_min = parseFloat(document.getElementById('temp_min').value);
    const temp_max = parseFloat(document.getElementById('temp_max').value);
    const rainfall_min = parseFloat(document.getElementById('rainfall_min').value);
    const rainfall_max = parseFloat(document.getElementById('rainfall_max').value);
    const season_requirement = document.getElementById('season_requirement').value;
    const yield_estimate = parseFloat(document.getElementById('yield_estimate').value);
    const yield_unit = document.getElementById('yield_unit').value;
    const common_pests = document.getElementById('common_pests').value;
    const common_diseases = document.getElementById('common_diseases').value;
    const soil_type = document.getElementById('soil_type').value;
    const fertilizer_recommendation = document.getElementById('fertilizer_recommendation').value;
    const irrigation_needs = document.getElementById('irrigation_needs').value;
    const planting_distance = document.getElementById('planting_distance').value;

    de.transaction(function(tx) {
        tx.executeSql('INSERT INTO crop_variety (crop_name, crop_variety, crop_availability, pH_min, pH_max, temp_min, temp_max, rainfall_min, rainfall_max, season_requirement, yield_estimate, yield_unit, common_pests, common_diseases, soil_type, fertilizer_recommendation, irrigation_needs, planting_distance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [crop_name, crop_variety, crop_availability, pH_min, pH_max, temp_min, temp_max, rainfall_min, rainfall_max, season_requirement, yield_estimate, yield_unit, common_pests, common_diseases, soil_type, fertilizer_recommendation, irrigation_needs, planting_distance], function(tx, res) {
            alert("Crop variety added successfully! ID: " + res.insertId);
            // Optionally clear the form or redirect
            document.getElementById('crop_form').reset();
        });
    });