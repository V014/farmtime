// auth.js
document.addEventListener('deviceready', onDeviceReady, false);

let db;

function onDeviceReady() {
    // Open the database
    db = window.sqlitePlugin.openDatabase({name: 'farmtime.db', location: 'default'});

    // Attach the click event to your button
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
    document.getElementById('signupBtn').addEventListener('click', handleSignup);
}

function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM users WHERE username=? AND password=?', [user, pass], function(tx, results) {
            if (results.rows.length > 0) {
                // alert("Login Successful!");
                window.location.href = "client/index.html"; // Move to the next page
            } else {
                alert("Invalid username or password.");
            }
        });
    });
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