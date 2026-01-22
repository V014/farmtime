// signup.js
document.addEventListener('deviceready', onDeviceReady, false);

let db;

function onDeviceReady() {
    // Open the database
    db = window.sqlitePlugin.openDatabase({name: 'farmtime.db', location: 'default'});

    // Attach the click event to your button
    document.getElementById('loginBtn').addEventListener('click', handleSignup);
}

function handleSignup() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const contact = document.getElementById('contact_number').value;
    const address = document.getElementById('address').value;

    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO Users (username, password, contact_number, address) VALUES (?, ?, ?, ?)', [user, pass, contact, address], function(tx, res) {
            // alert("Signup successful! User ID: " + res.insertId);
            window.location.href = "client/index.html"; // Move to the next page
        });
    }, function(error) {
        alert("Signup failed: " + error.message);
    });
}