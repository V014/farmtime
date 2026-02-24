onload = listPlots;

function listPlots() {
    db.transaction(function(tx) {
        tx.executeSql('SELECT p.id AS id, p.plot_name AS plot_name, p.area_height AS area_height, p.area_width AS area_width, f.field_name AS field_name FROM plot p INNER JOIN field f ON p.field_id = f.id WHERE f.user_id = (SELECT id FROM user WHERE status = "online")', [], function(tx, res) {
            const tbody = document.getElementById('plots_table').getElementsByTagName('tbody')[0];
            for (let i = 0; i < res.rows.length; i++) {
                const cv = res.rows.item(i);
                const tr = document.createElement('tr');
                tr.dataset.fieldId = cv.id;           // note: use `id`, not field_id
                tr.innerHTML = `
                    <td>${cv.plot_name}</td>
                    <td>${cv.area_height} x ${cv.area_width}</td>
                    <td>${cv.field_name}</td>
                    <td><button class="btn" onclick="window.location.href='../farmer/edit_plot.html?plot_id=${cv.id}'"><img src="../icons/pencil-square.svg" alt="Edit" width="16" height="16"></button></td>
                    <td><button class="btn" onclick="deletePlot(${cv.id})"><img src="../icons/trash3.svg" alt="Delete" width="16" height="16"></button></td>
                `;
                tbody.appendChild(tr);
            }
        }, function(tx, err) {
            alert('Error reading plots: ' + err.message);
        });
    }, function(txErr) {
        alert('transaction error: ' + txErr);
    });
}