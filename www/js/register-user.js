function saveUser(name, email) {
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    }, function(error) {
        console.error('Insert error: ' + error.message);
    }, function() {
        alert('User saved successfully!');
    });
}