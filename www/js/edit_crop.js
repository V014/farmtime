document.addEventListener('deviceready', onDeviceReady, false);

let currentCropId = null;

function onDeviceReady() {
    // Get field_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    currentCropId = urlParams.get('crop_id');

    if (currentCropId) {
        // Load the field data from database
        loadCropData(currentCropId);
        
        // Set up the edit button listener
        if (document.getElementById('editCropBtn')) {
            document.getElementById('editCropBtn').addEventListener('click', function(e) {
                updateCrop();
            });
        }
    } else {
        alert('No crop selected');
        window.location.href = '../farmer/crops.html';
    }
}

function loadPlotData(plotId) {
    db.transaction(function(tx) {
        tx.executeSql('SELECT p.plot_name, s.supplier_name, cv.crop_variety, c.batch_id, c.growth_stage, c.status FROM crop c INNER JOIN plot p ON c.plot_id = p.id INNER JOIN supplier s ON c.supplier_id = s.id INNER JOIN crop_variety cv ON c.crop_variety_id = cv.id WHERE c.id = ?', [plotId], function(tx, res) {
            if (res.rows.length > 0) {
                const crop = res.rows.item(0);
                const currentFieldName = plot.field_name;
                
                // Load all fields for the user
                tx.executeSql('SELECT id, field_name FROM field WHERE user_id = (SELECT id FROM user WHERE status = "online")', [], function(tx, fieldRes) {
                    const fieldSelect = document.getElementById('field');
                    
                    // Clear existing options except "Unspecified"
                    while (fieldSelect.options.length > 1) {
                        fieldSelect.remove(1);
                    }
                    
                    // Add all available fields and select the current one
                    for (let i = 0; i < fieldRes.rows.length; i++) {
                        const field = fieldRes.rows.item(i);
                        const option = document.createElement('option');
                        option.value = field.id;
                        option.textContent = field.field_name;
                        
                        // Mark the previously selected field
                        if (field.field_name === currentFieldName) {
                            option.selected = true;
                        }
                        
                        fieldSelect.appendChild(option);
                    }
                    
                    // Populate other form fields with existing data
                    document.getElementById('plot_name').value = plot.plot_name || '';
                    document.getElementById('area_height').value = plot.area_height || '';
                    document.getElementById('area_width').value = plot.area_width || '';
                });
            } else {
                alert('Plot not found');
                window.location.href = '../farmer/plots.html';
            }
        }, function(tx, err) {
            alert('Error loading plot: ' + err.message);
            window.location.href = '../farmer/plots.html';
        });
    });
}

function updatePlot() {
    const plot_name = document.getElementById('plot_name').value;
    const area_height = parseFloat(document.getElementById('area_height').value);
    const area_width = parseFloat(document.getElementById('area_width').value);
    const field_id = document.getElementById('field').value;

    // Validate required fields
    if (!plot_name || isNaN(area_height) || isNaN(area_width) || !field_id || field_id === 'unspecified') {
        alert("Please fill in all required fields correctly.");
        return;
    }

    db.transaction(function(tx) {
        try {
            tx.executeSql(
                'UPDATE plot SET plot_name=?, area_height=?, area_width=?, field_id=?, date_updated=? WHERE id=?',
                [plot_name, area_height, area_width, field_id, new Date().toISOString(), currentPlotId],
                function(tx, res) {
                    alert("Plot updated successfully!");
                    window.location.href = "../farmer/plots.html";
                }
            );
        } catch (error) {
            alert("Error updating plot: " + error.message);
        }
    });
}