var db = null;

document.addEventListener('deviceready', function() {
    // This line creates the physical .db file if it's the first time the app is opened.
    // Otherwise, it simply establishes a connection to the existing file.
    // Open the database
    db = window.sqlitePlugin.openDatabase({
        name: 'farmtime.db',
        location: 'default', // Essential for Android/iOS
        androidDatabaseProvider: 'system' // Recommended for modern Android
    });

    // If the tables already exist, does nothing, and moves to the "Success" callback
    // Initialize your tables
    db.transaction(function(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS settings (key text primary key, value text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS users (id integer primary key, name text, email text)');
    }, function(error) {
        console.error('Transaction Error: ' + error.message);
    }, function() {
        console.log('Database and Tables Ready!');
    });
}, false);