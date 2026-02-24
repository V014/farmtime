document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    if (document.getElementById('addPlotBtn')) {
        document.getElementById('addPlotBtn').addEventListener('click', function(e) {
            addField();
        });
    }
}

function addField() {
    const plot_name = document.getElementById('plot_name').value;
    const area_height = parseFloat(document.getElementById('area_height').value);
    const area_width = parseFloat(document.getElementById('area_width').value);
    const date_updated = new Date().toISOString();
    const date_recorded = new Date().toISOString();

    // if above fields are empty, show error and return
    if (!plot_name || isNaN(area_height) || isNaN(area_width)) {
        alert("Please fill in all fields correctly.");
        return;
    } else {
        db.transaction(function(tx) {
            tx.executeSql('SELECT id FROM user WHERE status = "online"', [], function(tx, res) {
                const userId = res.rows.length > 0 ? res.rows.item(0).id : null;
                tx.executeSql('SELECT id FROM field WHERE user_id = ?'
            }, function(tx, err) {
                alert('Error adding plot: ' + err.message);
            });
        }, function(tx, err) {
            alert('Error in transaction: ' + err.message);
            window.location.href = "../farmer/add_plot.html";
        });
    }
}