document.addEventListener('deviceready', onDeviceReady, false);

// This function is called when the user clicks on a crop variety row
function editCropVariety(cropId) {
    window.location.href = `../farmer/edit_crop_variety.html?crop_id=${cropId}`;
}