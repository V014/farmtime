document.addEventListener('deviceready', onDeviceReady, false);

let currentFieldId = null;

function onDeviceReady() {
    // Get field_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    currentFieldId = urlParams.get('field_id');

    if (currentFieldId) {
        // Load the field data from database
        loadFieldData(currentFieldId);
        
        // Set up the edit button listener
        if (document.getElementById('editFieldBtn')) {
            document.getElementById('editFieldBtn').addEventListener('click', function(e) {
                updateField();
            });
        }
    } else {
        alert('No field selected');
        window.location.href = '../farmer/field.html';
    }
}

function loadFieldData(fieldId) {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM field WHERE id = ?', [fieldId], function(tx, res) {
            if (res.rows.length > 0) {
                const field = res.rows.item(0);
                
                // Populate form fields with existing data
                document.getElementById('field_name').value = field.field_name || '';
                document.getElementById('area_height').value = field.area_height || '';
                document.getElementById('area_width').value = field.area_width || '';
                document.getElementById('soil_type').value = field.soil_type || 'unspecified';
                document.getElementById('tenure_type').value = field.tenure_type || 'unspecified';
                document.getElementById('location').value = field.location || '';
            } else {
                alert('Field not found');
                window.location.href = '../farmer/field.html';
            }
        }, function(tx, err) {
            alert('Error loading field: ' + err.message);
            window.location.href = '../farmer/field.html';
        });
    });
}

function updateField() {
    const field_name = document.getElementById('field_name').value;
    const area_height = parseFloat(document.getElementById('area_height').value);
    const area_width = parseFloat(document.getElementById('area_width').value);
    const soil_type = document.getElementById('soil_type').value;
    const tenure_type = document.getElementById('tenure_type').value;
    const location = document.getElementById('location').value;

    // Validate required fields
    if (!field_name || isNaN(area_height) || isNaN(area_width) || !soil_type || !tenure_type || !location) {
        alert("Please fill in all required fields correctly.");
        return;
    }

    db.transaction(function(tx) {
        try {
            tx.executeSql(
                'UPDATE field SET field_name=?, area_height=?, area_width=?, soil_type=?, tenure_type=?, location=?, date_updated=? WHERE id=?',
                [field_name, area_height, area_width, soil_type, tenure_type, location, new Date().toISOString(), currentFieldId],
                function(tx, res) {
                    alert("Field updated successfully!");
                    window.location.href = "../farmer/field.html";
                }
            );
        } catch (error) {
            alert("Error updating field: " + error.message);
        }
    });
}