function fetchUsers() {
    db.executeSql('SELECT * FROM users', [], function(rs) {
        // rs.rows.length tells you how many records were found
        for (var i = 0; i < rs.rows.length; i++) {
            var user = rs.rows.item(i);
            console.log('User found: ' + user.username + ' (' + user.role + ')');
        }
    }, function(error) {
        console.error('SELECT error: ' + error.message);
    });
}