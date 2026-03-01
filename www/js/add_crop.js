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
        tx.executeSql('SELECT p.plot_name, s.supplier_name, cv.crop_variety, c.batch_id, c.growth_stage, c.status FROM crop c INNER JOIN plot p ON c.plot_id = p.id INNER JOIN supplier s ON c.supplier_id = s.id INNER JOIN crop_variety cv ON c.crop_variety_id = cv.id WHERE c.user_id = (SELECT id FROM user WHERE status = "online")', [], function(tx, res) {
            const cropVarietySelect = document.getElementById('crop_variety');
            const supplierNameSelect = document.getElementById('supplier');
            const plotNameSelect = document.getElementById('plot');
            for (let i = 0; i < res.rows.length; i++) {
                const option = document.createElement('option');
                option.value = res.rows.item(i).id;
                option.textContent = res.rows.item(i).crop_variety;
                option.textContent = res.rows.item(i).supplier_name;
                option.textContent = res.rows.item(i).plot_name;
                cropVarietySelect.appendChild(option);
                supplierNameSelect.appendChild(option);
                plotNameSelect.appendChild(option);
            }
        }, function(tx, err) {
            alert('Error listing user data: ' + err.message);
        });
    });
}

function addCrop() {
    const plot_id = document.getElementById('plot').value;
    const supplier_id = document.getElementById('supplier').value;
    const batch_number = document.getElementById('batch_number').value;
    const growth_stage = document.getElementById('growth_stage').value;
    const status = document.getElementById('status').value;
    const date_updated = new Date().toISOString();
    const date_recorded = new Date().toISOString();

    // if above fields are empty, show error and return
    if (!plot_id || !supplier_id || !batch_number || !growth_stage || !status) {
        alert("Please fill in all fields correctly.");
        return;
    } else {
        db.transaction(function(tx) {
            tx.executeSql('SELECT id FROM user WHERE status = "online"', [], function(tx, res) {
                const userId = res.rows.length > 0 ? res.rows.item(0).id : null;
                tx.executeSql(
                    'INSERT INTO crop (user_id, plot_id, supplier_id, batch_number, growth_stage, status, date_updated, date_recorded) ' +
                    'VALUES (?,?,?,?,?,?,?,?,?)',
                    [userId, plot_id, supplier_id, batch_number, growth_stage, status, date_updated, date_recorded],
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