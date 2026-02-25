onload = listSuppliers;

function listSuppliers() {
    db.transaction(function(tx) {
        tx.executeSql('SELECT id, supplier_name, contact, address FROM supplier', [], function(tx, res) {
            const tbody = document.getElementById('supplier_table').getElementsByTagName('tbody')[0];
            for (let i = 0; i < res.rows.length; i++) {
                const cv = res.rows.item(i);
                const tr = document.createElement('tr');
                tr.dataset.supplierId = cv.id;           // note: use `id`, not supplier_id
                tr.innerHTML = `
                    <td>${cv.supplier_name}</td>
                    <td>${cv.contact}</td>
                    <td>${cv.address}</td>
                    <td><button class="btn" onclick="window.location.href='../farmer/edit_supplier.html?supplier_id=${cv.id}'"><img src="../icons/pencil-square.svg" alt="Edit" width="16" height="16"></button></td>
                    <td><button class="btn" onclick="deleteSupplier(${cv.id})"><img src="../icons/trash3.svg" alt="Delete" width="16" height="16"></button></td>
                `;
                tbody.appendChild(tr);
            }
        }, function(tx, err) {
            alert('Error reading suppliers: ' + err.message);
        });
    }, function(txErr) {
        alert('transaction error: ' + txErr);
    });
}