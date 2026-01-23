// auth.js
document.addEventListener('deviceready', onDeviceReady, false);

// db is declared in connection.js

function onDeviceReady() {
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
    const contact = parseInt(document.getElementById('contact_number').value);
    const address = document.getElementById('address').value;
    const now = new Date().toISOString();

    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO users (username, password, role, date_registered) VALUES (?, ?, ?, ?)', [user, pass, 'farmer', now], function(tx, res) {
            const userId = res.insertId;
            tx.executeSql('INSERT INTO user_profile (user_id, contact, address, date_updated) VALUES (?, ?, ?, ?)', [userId, contact, address, now], function(tx, res2) {
                // alert("Signup successful! User ID: " + userId);
                window.location.href = "client/index.html"; // Move to the next page
            }, function(tx, error) {
                alert("Signup failed: " + error.message);
            });
        }, function(tx, error) {
            alert("Signup failed: " + error.message);
        });
    }, function(error) {
        alert("Transaction failed: " + error.message);
    });
}