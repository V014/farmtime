document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    if (document.getElementById('addCropBtn')) {
        document.getElementById('addCropBtn').addEventListener('click', function(e) {
            addCrop();
        });
    }
    listData();
}

// list user's crop varieties, plots and suppliers in the dropdown
function listData() {
    db.transaction(function(tx) {
        tx.executeSql('SELECT id, crop_variety FROM crop_variety', [], function(tx, res) {
            const cropVarietySelect = document.getElementById('crop_variety');
            for (let i = 0; i < res.rows.length; i++) {
                const row = res.rows.item(i);
                const option = document.createElement('option');
                option.value = row.id;
                option.textContent = row.crop_variety;
                cropVarietySelect.appendChild(option);
            }
        }, function(tx, err) {
            console.log('Error listing crop varieties: ' + err.message);
        });

        tx.executeSql('SELECT id, supplier_name FROM supplier', [], function(tx, res) {
            const supplierNameSelect = document.getElementById('supplier');
            for (let i = 0; i < res.rows.length; i++) {
                const row = res.rows.item(i);
                const option = document.createElement('option');
                option.value = row.id;
                option.textContent = row.supplier_name;
                supplierNameSelect.appendChild(option);
            }
        }, function(tx, err) {
            console.log('Error listing suppliers: ' + err.message);
        });

        tx.executeSql('SELECT id, plot_name FROM plot', [], function(tx, res) {
            const plotNameSelect = document.getElementById('plot');
            for (let i = 0; i < res.rows.length; i++) {
                const row = res.rows.item(i);
                const option = document.createElement('option');
                option.value = row.id;
                option.textContent = row.plot_name;
                plotNameSelect.appendChild(option);
            }
        }, function(tx, err) {
            console.log('Error listing plots: ' + err.message);
        });
    }, function(tx, err) {
        alert('Error listing user data: ' + err.message);
    });
}

function addCrop() {
    const plot_id = document.getElementById('plot').value;
    const supplier_id = document.getElementById('supplier').value;
    const crop_variety_id = document.getElementById('crop_variety').value;
    const batch_number = document.getElementById('batch_number').value;
    const growth_stage = document.getElementById('growth_stage').value;
    const status = document.getElementById('status').value;
    const date_updated = new Date().toISOString();
    const date_recorded = new Date().toISOString();

    // if above fields are empty, show error and return
    if (!plot_id || !supplier_id || !crop_variety_id || !batch_number || !growth_stage || !status) {
        alert("Please fill in all fields correctly.");
        return;
    } else {
        db.transaction(function(tx) {
            tx.executeSql('SELECT id FROM user WHERE status = "online"', [], function(tx, res) {
                const userId = res.rows.length > 0 ? res.rows.item(0).id : null;
                tx.executeSql(
                    'INSERT INTO crop (plot_id, supplier_id, crop_variety_id, batch_number, growth_stage, status, date_updated, date_recorded) ' +
                    'VALUES (?,?,?,?,?,?,?,?)',
                    [userId, plot_id, supplier_id, crop_variety_id, batch_number, growth_stage, status, date_updated, date_recorded],
                function(tx, res) {
                    alert("Crop added successfully!");
                    window.location.href = "../farmer/crops.html";
                });
            }, function(tx, err) {
                alert('Error adding crop: ' + err.message);
            });
        }, function(tx, err) {
            alert('Error in transaction: ' + err.message);
            window.location.href = "../farmer/add_crop.html";
        });
    }
}