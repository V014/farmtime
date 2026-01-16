function signupUser(username, password) {
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO Users (username, password) VALUES (?, ?)', [username, password], function(tx, res) {
            alert("Signup successful! User ID: " + res.insertId);
        });
    }, function(error) {
        alert("Signup failed: " + error.message);
    });
}