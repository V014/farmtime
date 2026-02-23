function logout() {
    db.transaction(function(tx) {
        tx.executeSql('UPDATE user SET status = ? WHERE status = ?', ['offline', 'online']);
    });
}