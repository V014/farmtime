document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Get crop_id from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cropId = urlParams.get('crop_id');

    if (cropId) {
        // Confirm deletion with the user
        if (!confirm("Are you sure you want to delete this crop variety? This action cannot be undone.")) {
            window.location.href = '../farmer/crop_variety.html';
            return;
        } else {
            // Delete the crop variety from the database
            db.transaction(function(tx) {
                tx.executeSql('DELETE FROM crop_variety WHERE id = ?', [cropId], function(tx, res) {
                    alert("Crop variety deleted successfully!");
                    window.location.href = "../farmer/crop_variety.html";
                }, function(tx, err) {
                    alert("Error deleting crop variety: " + err.message);
                });
            });
        }
    } else {
        alert('No crop variety selected');
        window.location.href = '../farmer/crop_variety.html';
    }
};

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing 
 */