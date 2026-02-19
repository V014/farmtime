document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Attach the click event to the add form button (if present)
    if (document.getElementById('addCropVarietyBtn')) {
        document.getElementById('addCropVarietyBtn').addEventListener('click', function(e) {
            e.preventDefault(); // stop form submission if any
            addCropVariety();
        });
    }
}

function addCropVariety() {
    const crop_name = document.getElementById('crop_name').value;
    const crop_variety = document.getElementById('crop_variety').value;
    const availability = document.getElementById('availability').value;
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
    const fertilizer_growth = document.getElementById('fertilizer_growing').value;
    const growth_days = document.getElementById('growth_days').value;
    const fertilizer_production = document.getElementById('fertilizer_production').value;
    const production_days = document.getElementById('production_days').value;
    const irrigation_needs = document.getElementById('irrigation_needs').value;
    const planting_distance = document.getElementById('planting_distance').value;

    db.transaction(function(tx) {
        try {
            tx.executeSql(
                'INSERT INTO crop_variety (crop_name, crop_variety, availability, pH_min, pH_max, temp_min, temp_max, rainfall_min, rainfall_max, ' +
                'season_requirement, yield_estimate, yield_unit, common_pests, common_diseases, soil_type, fertilizer_growing, growth_days, ' +
                'fertilizer_production, production_days, irrigation_needs, planting_distance, date_updated, date_recorded) ' +
                'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [crop_name, crop_variety, availability, pH_min, pH_max, temp_min, temp_max,
                 rainfall_min, rainfall_max, season_requirement, yield_estimate, yield_unit,
                 common_pests, common_diseases, soil_type, fertilizer_growth, growth_days,
                 fertilizer_production, production_days, irrigation_needs, planting_distance, 
                 new Date().toISOString(), new Date().toISOString()],
                function(tx, res) {
                    alert("Crop variety added successfully!");
                    window.location.href = "../farmer/crop_variety.html";
                });
        } catch (error) {
            alert("Error adding crop variety: " + error.message);
            console.error(error);
            window.location.href = "../farmer/add_crop_variety.html";
        }
    });
}