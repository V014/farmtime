document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    if (document.getElementById('addSupplierBtn')) {
        document.getElementById('addSupplierBtn').addEventListener('click', function(e) {
            addSupplier();
        });
    }
}

function addSupplier() {
    const supplier_name = document.getElementById('supplier_name').value;
    const contact = parseFloat(document.getElementById('contact').value);
    const address = document.getElementById('address').value;
    const date_updated = new Date().toISOString();
    const date_recorded = new Date().toISOString();

    // if above fields are empty, show error and return
    if (!supplier_name || !contact || !address) {
        alert("Please fill in all fields correctly.");
        return;
    } else {
        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO supplier (supplier_name, contact, address, date_registered, date_updated) VALUES (?,?,?,?,?)', [supplier_name, contact, address, date_recorded, date_updated], function(tx, res) {
                alert("Supplier added successfully.");
                window.location.href = "../farmer/supplier.html";
            }, function(tx, err) {
                alert('Error adding supplier: ' + err.message);
                window.location.href = "../farmer/add_supplier.html";
            });
        }, function(tx, err) {
            alert('Error in transaction: ' + err.message);
            window.location.href = "../farmer/supplier.html";
        });
    }
}