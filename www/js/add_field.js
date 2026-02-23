document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    if (document.getElementById('addFieldBtn')) {
        document.getElementById('addFieldBtn').addEventListener('click', function(e) {
            addField();
        });
    }
}

function addField() {
    const field_name = document.getElementById('field_name').value;
    const area_height = parseFloat(document.getElementById('area_height').value);
    const area_width = parseFloat(document.getElementById('area_width').value);
    const soil_type = document.getElementById('soil_type').value;
    const tenure_type = document.getElementById('tenure_type').value;
    const location = document.getElementById('location').value;

    // if above fields are empty, show error and return
    if (!field_name || isNaN(area_height) || isNaN(area_width) || !soil_type || !tenure_type || !location) {
        alert("Please fill in all fields correctly.");
        return;
    } else {
        db.transaction(function(tx) {
            try {
                tx.executeSql(
                    'INSERT INTO field (field_name, area_height, area_width, soil_type, tenure_type, location, date_updated, date_recorded) ' +
                    'VALUES (?,?,?,?,?,?,?,?)',
                    [field_name, area_height, area_width, soil_type, tenure_type, location,
                    new Date().toISOString(), new Date().toISOString()],
                    function(tx, res) {
                        alert("Field added successfully!");
                        window.location.href = "../farmer/field.html";
                    });
            } catch (error) {
                alert("Error adding field: " + error.message);
                window.location.href = "../farmer/add_field.html";
            }
        });
    }
}