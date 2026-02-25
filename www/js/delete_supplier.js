document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Get field_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const supplierId = urlParams.get('supplier_id');
    if (supplierId){
        deleteSupplier(supplierId);
    }
}

function deleteSupplier(supplierId) {
    // Confirm deletion with the user
    if (!confirm("Are you sure you want to delete this supplier? This action cannot be undone.")) {
        window.location.href = '../farmer/supplier.html';
        return;
    } else {
        // Delete the supplier from the database
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM supplier WHERE id = ?', [supplierId], function(tx, res) {
                alert("Supplier deleted successfully!");
                window.location.href = "../farmer/supplier.html";
            }, function(tx, err) {
                alert("Error deleting supplier: " + err.message);
            });
        });
    }
}