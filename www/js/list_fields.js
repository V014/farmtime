onload = listFields;

function listFields() {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM field', [], function(tx, res) {
            const tbody = document.getElementById('fields_table').getElementsByTagName('tbody')[0];
            for (let i = 0; i < res.rows.length; i++) {
                const cv = res.rows.item(i);
                const tr = document.createElement('tr');
                tr.dataset.fieldId = cv.id;           // note: use `id`, not field_id
                tr.innerHTML = `
                    <td>${cv.field_name}</td>
                    <td>${cv.area_height} x ${cv.area_width}</td>
                    <td>${cv.soil_type}</td>
                    <td><button class="btn" onclick="window.location.href='../farmer/edit_field.html?field_id=${cv.id}'"><img src="../icons/pencil-square.svg" alt="Edit" width="16" height="16"></button></td>
                    <td><button class="btn" onclick="deleteField(${cv.id})"><img src="../icons/trash3.svg" alt="Delete" width="16" height="16"></button></td>
                `;
                tbody.appendChild(tr);
            }
        }, function(tx, err) {
            alert('Error reading fields: ' + err.message);
        });
    }, function(txErr) {
        alert('transaction error: ' + txErr);
    });
}