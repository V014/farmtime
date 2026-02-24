document.addEventListener('deviceready', onDeviceReady, false);

let currentPlotId = null;

function onDeviceReady() {
    // Get field_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    currentPlotId = urlParams.get('plot_id');

    if (currentPlotId) {
        // Load the field data from database
        loadPlotData(currentPlotId);
        
        // Set up the edit button listener
        if (document.getElementById('editPlotBtn')) {
            document.getElementById('editPlotBtn').addEventListener('click', function(e) {
                updatePlot();
            });
        }
    } else {
        alert('No plot selected');
        window.location.href = '../farmer/plots.html';
    }
}

function loadPlotData(plotId) {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM plot WHERE id = ?', [plotId], function(tx, res) {
            if (res.rows.length > 0) {
                const plot = res.rows.item(0);
                
                // Populate form fields with existing data
                document.getElementById('plot_name').value = plot.plot_name || '';
                document.getElementById('area_height').value = plot.area_height || '';
                document.getElementById('area_width').value = plot.area_width || '';
                document.getElementById('field').value = plot.field_id || 'unspecified';
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