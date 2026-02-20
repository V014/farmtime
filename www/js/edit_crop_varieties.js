document.addEventListener('deviceready', onDeviceReady, false);

let currentCropId = null;

function onDeviceReady() {
    // Get crop_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    currentCropId = urlParams.get('crop_id');

    if (currentCropId) {
        // Load the crop variety data from database
        loadCropVarietyData(currentCropId);
        
        // Set up the edit button listener
        if (document.getElementById('editCropVarietyBtn')) {
            document.getElementById('editCropVarietyBtn').addEventListener('click', function(e) {
                updateCropVariety();
            });
        }
    } else {
        alert('No crop variety selected');
        window.location.href = '../farmer/crop_variety.html';
    }
}

function loadCropVarietyData(cropId) {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM crop_variety WHERE id = ?', [cropId], function(tx, res) {
            if (res.rows.length > 0) {
                const cv = res.rows.item(0);
                
                // Populate form fields with existing data
                document.getElementById('crop_name').value = cv.crop_name || '';
                document.getElementById('crop_variety').value = cv.crop_variety || '';
                document.getElementById('availability').value = cv.availability || 'unspecified';
                document.getElementById('pH_min').value = cv.pH_min || '';
                document.getElementById('pH_max').value = cv.pH_max || '';
                document.getElementById('temp_min').value = cv.temp_min || '';
                document.getElementById('temp_max').value = cv.temp_max || '';
                document.getElementById('rainfall_min').value = cv.rainfall_min || '';
                document.getElementById('rainfall_max').value = cv.rainfall_max || '';
                document.getElementById('season_requirement').value = cv.season_requirement || 'unspecified';
                document.getElementById('yield_estimate').value = cv.yield_estimate || '';
                document.getElementById('yield_unit').value = cv.yield_unit || 'unspecified';
                document.getElementById('common_pests').value = cv.common_pests || '';
                document.getElementById('common_diseases').value = cv.common_diseases || '';
                document.getElementById('soil_type').value = cv.soil_type || 'unspecified';
                // Map fertilizer_planting form field to fertilizer_growing database field
                document.getElementById('fertilizer_planting').value = cv.fertilizer_growing || 'unspecified';
                // Map fertilizer_growing form field to fertilizer_production database field
                document.getElementById('fertilizer_growing').value = cv.fertilizer_production || 'unspecified';
                document.getElementById('irrigation_needs').value = cv.irrigation_needs || 'unspecified';
                document.getElementById('planting_distance').value = cv.planting_distance || '';
            } else {
                alert('Crop variety not found');
                window.location.href = '../farmer/crop_variety.html';
            }
        }, function(tx, err) {
            alert('Error loading crop variety: ' + err.message);
            window.location.href = '../farmer/crop_variety.html';
        });
    });
}

function updateCropVariety() {
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
    const fertilizer_growing = document.getElementById('fertilizer_planting').value;
    const fertilizer_production = document.getElementById('fertilizer_growing').value;
    const irrigation_needs = document.getElementById('irrigation_needs').value;
    const planting_distance = document.getElementById('planting_distance').value;

    // Validate required fields
    if (!crop_name || !crop_variety || !availability || isNaN(pH_min) || isNaN(pH_max) || 
        isNaN(temp_min) || isNaN(temp_max) || isNaN(rainfall_min) || isNaN(rainfall_max) || 
        !season_requirement || isNaN(yield_estimate) || !yield_unit || !common_pests || 
        !common_diseases || !soil_type || !irrigation_needs || !planting_distance) {
        alert("Please fill in all required fields correctly.");
        return;
    }

    db.transaction(function(tx) {
        try {
            tx.executeSql(
                'UPDATE crop_variety SET crop_name=?, crop_variety=?, availability=?, pH_min=?, pH_max=?, ' +
                'temp_min=?, temp_max=?, rainfall_min=?, rainfall_max=?, season_requirement=?, ' +
                'yield_estimate=?, yield_unit=?, common_pests=?, common_diseases=?, soil_type=?, ' +
                'fertilizer_growing=?, fertilizer_production=?, irrigation_needs=?, planting_distance=?, date_updated=? ' +
                'WHERE id=?',
                [crop_name, crop_variety, availability, pH_min, pH_max, temp_min, temp_max,
                 rainfall_min, rainfall_max, season_requirement, yield_estimate, yield_unit,
                 common_pests, common_diseases, soil_type, fertilizer_growing, fertilizer_production,
                 irrigation_needs, planting_distance, new Date().toISOString(), currentCropId],
                function(tx, res) {
                    alert("Crop variety updated successfully!");
                    window.location.href = "../farmer/crop_variety.html";
                }
            );
        } catch (error) {
            alert("Error updating crop variety: " + error.message);
        }
    });
}