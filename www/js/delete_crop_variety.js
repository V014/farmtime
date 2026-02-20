document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Get crop_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cropId = urlParams.get('crop_id');
    if (cropId){
        deleteVariety(cropId);
    }
}

function deleteVariety(Id) {
    // Confirm deletion with the user
    if (!confirm("Are you sure you want to delete this crop variety? This action cannot be undone.")) {
        window.location.href = '../farmer/crop_variety.html';
        return;
    } else {
        // Delete the crop variety from the database
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM crop_variety WHERE id = ?', [Id], function(tx, res) {
                alert("Crop variety deleted successfully!");
                window.location.href = "../farmer/crop_variety.html";
            }, function(tx, err) {
                alert("Error deleting crop variety: " + err.message);
            });
        });
    }
}