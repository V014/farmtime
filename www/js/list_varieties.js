onload = listVarieties;

function listVarieties() {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM crop_variety', [], function(tx, res) {
            const tbody = document.getElementById('crop_varieties_table').getElementsByTagName('tbody')[0];
            for (let i = 0; i < res.rows.length; i++) {
                const cv = res.rows.item(i);
                const tr = document.createElement('tr');
                tr.dataset.cropId = cv.id;           // note: use `id`, not crop_id
                tr.innerHTML = `
                    <td>${cv.crop_name}</td>
                    <td>${cv.crop_variety}</td>
                    <td>${cv.availability}</td>
                    <td>${cv.yield_estimate ?? ''}${cv.yield_unit ? ' ' + cv.yield_unit : ''}</td>
                    <td><button class="btn btn-primary rounded-circle" onclick="window.location.href='../farmer/edit_crop_variety.html?crop_id=${cv.id}'">
                            <img src="../icons/pencil-square.svg" alt="Edit" width="16" height="16">
                        </button></td>
                    <td><button class="btn btn-danger rounded-circle" onclick="deleteVariety(${cv.id})">
                            <img src="../icons/trash3.svg" alt="Delete" width="16" height="16">
                        </button></td>
                `;
                tbody.appendChild(tr);
            }
        }, function(tx, err) {
            alert('Error reading varieties: ' + err.message);
        });
    }, function(txErr) {
        alert('transaction error: ' + txErr);
    });
}