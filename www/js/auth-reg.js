// auth.js
document.addEventListener('deviceready', onDeviceReady, false);

// db is declared in connection.js

function onDeviceReady() {
    // Attach the click event to your button
    if (document.getElementById('loginBtn')) {
        document.getElementById('loginBtn').addEventListener('click', handleLogin);
    }
    if (document.getElementById('signupBtn')) {
        document.getElementById('signupBtn').addEventListener('click', handleSignup);
    }
}

function handleLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM user WHERE username=? AND password=?', [user, pass], function(tx, results) {
            if (results.rows.length > 0) {
                // alert("Login Successful!");
                window.location.href = "../farmer/index.html"; // Move to the next page
            } else {
                alert("Invalid username or password.");
            }
        });
    });
}

function handleSignup() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const passConfirm = document.getElementById('passwordConfirm').value;
    const contact = parseInt(document.getElementById('contact').value);
    const address = document.getElementById('address').value;
    const now = new Date().toISOString();

    if (pass == passConfirm) {
        db.transaction(function(tx) {
        tx.executeSql('INSERT INTO user (username, password, role, date_registered) VALUES (?, ?, ?, ?)', [user, pass, 'farmer', now], function(tx, res) {
            const userId = res.insertId;
            tx.executeSql('INSERT INTO user_profile (user_id, contact, address, date_updated) VALUES (?, ?, ?, ?)', [userId, contact, address, now], function(tx, res2) {
                // alert("Signup successful! User ID: " + userId);
                window.location.href = "../farmer/index.html"; // Move to the next page
            }, function(tx, error) {
                alert("Signup failed: " + error.message);
            });
        }, function(tx, error) {
            alert("Signup failed: " + error.message);
        });
        }, function(error) {
            alert("Transaction failed: " + error.message);
        });
    } else {
        alert("Passwords do not match.");
        window.location.href = "../index.html"; // Move back to signup
    }
}