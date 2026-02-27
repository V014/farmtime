document.addEventListener('deviceready', onDeviceReady, false);

let currentSupplierId = null;

function onDeviceReady() {
    // Get supplier_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    currentSupplierId = urlParams.get('supplier_id');

    if (currentSupplierId) {
        // Load the supplier data from database
        loadSupplierData(currentSupplierId);
        
        // Set up the edit button listener
        if (document.getElementById('editSupplierBtn')) {
            document.getElementById('editSupplierBtn').addEventListener('click', function(e) {
                updateSupplier();
            });
        }
    } else {
        alert('No supplier selected');
        window.location.href = '../farmer/supplier.html';
    }
}

function loadSupplierData(supplierId) {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM supplier WHERE id = ?', [supplierId], function(tx, res) {
            if (res.rows.length > 0) {
                const supplier = res.rows.item(0);
                
                // Populate form fields with existing data
                document.getElementById('supplier_name').value = supplier.supplier_name || '';
                document.getElementById('contact').value = supplier.contact || '';
                document.getElementById('address').value = supplier.address || '';
            } else {
                alert('Supplier not found');
                window.location.href = '../farmer/supplier.html';
            }
        }, function(tx, err) {
            alert('Error loading supplier: ' + err.message);
            window.location.href = '../farmer/supplier.html';
        });
    });
}

function updateSupplier() {
    const supplier_name = document.getElementById('supplier_name').value;
    const contact = document.getElementById('contact').value;
    const address = document.getElementById('address').value;

    // Validate required fields
    if (!supplier_name || !contact || !address) {
        alert("Please fill in all required fields correctly.");
        return;
    }

    db.transaction(function(tx) {
        try {
            tx.executeSql(
                'UPDATE supplier SET supplier_name=?, contact=?, address=?, date_updated=? WHERE id=?',
                [supplier_name, contact, address, new Date().toISOString(), currentSupplierId],
                function(tx, res) {
                    alert("Supplier updated successfully!" + res.rowsAffected + " row(s) affected.");
                    window.location.href = "../farmer/supplier.html";
                }
            );
        } catch (error) {
            alert("Error updating supplier: " + error.message);
        }
    });
}