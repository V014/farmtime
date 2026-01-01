var db = null;

document.addEventListener('deviceready', function() {
    // Open (or create) the database
    db = window.sqlitePlugin.openDatabase({
        name: 'my_app_data.db',
        location: 'default', // Essential for Android/iOS
        androidDatabaseProvider: 'system' // Recommended for modern Android
    });

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