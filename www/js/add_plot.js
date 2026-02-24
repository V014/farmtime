document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    if (document.getElementById('addPlotBtn')) {
        document.getElementById('addPlotBtn').addEventListener('click', function(e) {
            addField();
        });
    }
    listFields();
}

// list user's fields in the dropdown
function listFields() {
    db.transaction(function(tx) {
        tx.executeSql('SELECT id, field_name FROM field WHERE user_id = (SELECT id FROM user WHERE status = "online")', [], function(tx, res) {
            const fieldSelect = document.getElementById('field');
            for (let i = 0; i < res.rows.length; i++) {
                const option = document.createElement('option');
                option.value = res.rows.item(i).id;
                option.textContent = res.rows.item(i).field_name;
                fieldSelect.appendChild(option);
            }
        }, function(tx, err) {
            alert('Error listing fields: ' + err.message);
        });
    });
}

function addField() {
    const plot_name = document.getElementById('plot_name').value;
    const area_height = parseFloat(document.getElementById('area_height').value);
    const area_width = parseFloat(document.getElementById('area_width').value);
    const field_id = parseInt(document.getElementById('field').value);
    const date_updated = new Date().toISOString();
    const date_recorded = new Date().toISOString();

    // if above fields are empty, show error and return
    if (!plot_name || isNaN(area_height) || isNaN(area_width) || isNaN(field_id)) {
        alert("Please fill in all fields correctly.");
        return;
    } else {
        db.transaction(function(tx) {
            tx.executeSql('SELECT id FROM user WHERE status = "online"', [], function(tx, res) {
                const userId = res.rows.length > 0 ? res.rows.item(0).id : null;
                tx.executeSql('SELECT id FROM field WHERE user_id = ? AND id = ?', [userId, field_id], function(tx, res) {
                    if (res.rows.length > 0) {
                        tx.executeSql('INSERT INTO plot (name, area_height, area_width, field_id, date_updated, date_recorded) VALUES (?, ?, ?, ?, ?, ?)', [plot_name, area_height, area_width, field_id, date_updated, date_recorded], function(tx, res) {
                            alert("Plot added successfully.");
                            window.location.href = "../farmer/plots.html";
                        }, function(tx, err) {
                            alert('Error adding plot: ' + err.message);
                        });
                    } else {
                        alert("Field does not belong to the current user.");
                    }
                }, function(tx, err) {
                    alert('Error validating field: ' + err.message);
                });
            }, function(tx, err) {
                alert('Error adding plot: ' + err.message);
            });
        }, function(tx, err) {
            alert('Error in transaction: ' + err.message);
            window.location.href = "../farmer/add_plot.html";
        });
    }
}