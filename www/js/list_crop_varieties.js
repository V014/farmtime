// this code lists the crop varieties in the database, and allows the user to click on one to edit it
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM crop_variety', [], function(tx, res) {
            const cropVarietyList = document.getElementById('crop_variety_list');
            for (let i = 0; i < res.rows.length; i++) {
                const cropVariety = res.rows.item(i);
                const listItem = document.createElement('li');
                listItem.textContent = cropVariety.crop_name + ' - ' + cropVariety.crop_variety;
                listItem.setAttribute('data-crop-id', cropVariety.crop_id);
                listItem.addEventListener('click', function() {
                    const cropId = this.getAttribute('data-crop-id');
                    // navigate to edit crop variety page with the crop id as a query parameter
                    window.location.href = "../farmer/edit_crop_variety.html?crop_id=" + cropId;
                });
                cropVarietyList.appendChild(listItem);
            }
        });
    });
}