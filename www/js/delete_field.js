document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Get field_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const fieldId = urlParams.get('field_id');
    if (fieldId){
        deleteField(fieldId);
    }
}

function deleteField(fieldId) {
    // Confirm deletion with the user
    if (!confirm("Are you sure you want to delete this field? This action cannot be undone.")) {
        window.location.href = '../farmer/field.html';
        return;
    } else {
        // Delete the field from the database
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM field WHERE id = ?', [fieldId], function(tx, res) {
                alert("Field deleted successfully!");
                window.location.href = "../farmer/field.html";
            }, function(tx, err) {
                alert("Error deleting field: " + err.message);
            });
        });
    }
}