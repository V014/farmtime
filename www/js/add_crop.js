// add crop.js
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Attach the click event to your button
    if (document.getElementById('add_crop')) {
        document.getElementById('add_crop').addEventListener('click', addCrop);
    }
}