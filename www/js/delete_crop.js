document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Get field_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cropId = urlParams.get('crop_id');
    if (cropId){
        deleteCrop(cropId);
    }
}

function deleteCrop(cropId) {
    // Confirm deletion with the user
    if (!confirm("Are you sure you want to delete this crop? This action cannot be undone.")) {
        window.location.href = '../farmer/crops.html';
        return;
    } else {
        // Delete the crop from the database
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM crop WHERE id = ?', [cropId], function(tx, res) {
                alert("Crop deleted successfully!");
                window.location.href = "../farmer/crops.html";
            }, function(tx, err) {
                alert("Error deleting crop: " + err.message);
            });
        });
    }
}