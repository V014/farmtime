document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Get plot_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const plotId = urlParams.get('plot_id');
    if (plotId){
        deletePlot(plotId);
    }
}

function deletePlot(plotId) {
    // Confirm deletion with the user
    if (!confirm("Are you sure you want to delete this plot? This action cannot be undone.")) {
        window.location.href = '../farmer/plots.html';
        return;
    } else {
        // Delete the plot from the database
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM plot WHERE id = ?', [plotId], function(tx, res) {
                alert("Plot deleted successfully!");
                window.location.href = "../farmer/plots.html";
            }, function(tx, err) {
                alert("Error deleting plot: " + err.message);
            });
        });
    }
}