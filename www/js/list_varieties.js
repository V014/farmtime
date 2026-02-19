function onDeviceReady() {
    // If this page contains the crop_varieties_table id, populate it
    if (document.getElementById('crop_varieties_table')) {
        listVarieties();
    }
}

function listVarieties() {
    alert("list varieties block is working");
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM crop_variety', [], function(tx, res) {
            const tbody = document.getElementById('crop_varieties_table').getElementsByTagName('tbody')[0];
            // tbody.innerHTML = '';   // clear sample rows
            for (let i = 0; i < res.rows.length; i++) {
                const cv = res.rows.item(i);
                const tr = document.createElement('tr');
                tr.dataset.cropId = cv.id;           // note: use `id`, not crop_id
                tr.innerHTML = `
                    <td>${cv.crop_name}</td>
                    <td>${cv.crop_variety}</td>
                    <td>${cv.availability}</td>
                    <td>${cv.pH_min ?? ''}-${cv.pH_max ?? ''}</td>
                    <td>${cv.temp_min ?? ''}-${cv.temp_max ?? ''}</td>
                    <td>${cv.yield_estimate ?? ''}${cv.yield_unit ? ' ' + cv.yield_unit : ''}</td>
                `;
                tr.addEventListener('click', () => {
                    window.location.href = `../farmer/edit_crop_variety.html?crop_id=${cv.id}`;
                });
                tbody.appendChild(tr);
            }
        }, function(tx, err) {
            alert('Error reading varieties: ' + err.message);
        });
    }, function(txErr) {
        alert('transaction error: ' + txErr);
    });
}