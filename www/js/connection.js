/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
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
        // 1. User Management Tables
        tx.executeSql('CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, key text, value text, date_update text)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS user (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL, date_registered DATETIME NOT NULL, date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS user_profile (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, email TEXT, contact INTEGER, address TEXT, picture TEXT, date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES user(id))');
        // 2. Farm Management Tables
        tx.executeSql('CREATE TABLE IF NOT EXISTS Field (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, field_name TEXT NOT NULL, area_size INTEGER NOT NULL, location TEXT NOT NULL, area_unit TEXT NOT NULL, soil_type TEXT NOT NULL, tenure_type TEXT NOT NULL, date_recorded DATETIME NOT NULL, date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES user(id))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS plot (id INTEGER NOT NULL PIMARY KEY AUTOINCREMENT, field_id INTEGER NOT NULL, plot_name TEXT NOT NULL, area_size INTEGER NOT NULL, area_unit TEXT NOT NULL, date_recorded DATETIME NOT NULL, date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(field_id) REFERENCES field(id))');
        // 3. Crop Management Tables
        tx.executeSql('CREATE TABLE IF NOT EXISTS crop_variety (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, crop_name TEXT NOT NULL, crop_variety TEXT NOT NULL, availabilty TEXT NOT NULL, pH_requirement INTEGER, temperature_celsius INTEGER, rainfall_mm INTEGER, season_requirement TEXT NOT NULL, maturity_rate INTEGER, yield_estimate INTEGER, yield_unit TEXT, common_pests TEXT, treatment TEXT NOT NULL, date_recorded DATETIME NOT NULL, date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS supplier(id INTEGER NOT NULL PRIMARY AUTOINCREMENT, supplier_name TEXT NOT NULL, contact INTEGER NOT NULL, address TEXT NOT NULL, date_registered DATETIME NOT NULL, date_updated DATETIME NOT NULL DEFAUT CURRENT_TIMESTAMP)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS crop (id INTEGER NOT NUL PRIMARY KEY AUTOINCREMENT, plot_id INTEGER NOT NULL, crop_variety_id INT NOT NULL, supplier_id INTEGER, crop_type TEXT NOT NULL, batch_id TEXT, intercropping TEXT NOT NULL, growth_stage TEXT NOT NULL, status TEXT NOT NULL, date_registered DATETIME NOT NULL, date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(plot_id) REFERENCES plot(id), FOREIGN KEY(crop_variety_id) REFERENCES crop_variety(id), FOREIGN KEY(supplier_id) REFERENCES supplier(id))');
        // 4. Farm Activities and Reccommendations Tables
        tx.executeSql('CREATE TABLE IF NOT EXISTS activity(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, crop_id INTEGER NOT NULL, activity_type TEXT NOT NULL, labor_type TEXT NOT NULL, cost_mwk INTEGER, input_quantity INTEGER, input_unit TEXT NOT NULL, date_recorded DATETIME NOT NULL, date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (crop_id) REFERENCES crop(id) ON DELETE CASCADE)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS recommendations (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, crop_id INTEGER NOT NULL, remarks TEXT, date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP , FOREIGN KEY(user_id) REFERENCES user(id), FOREIGN KEY(crop_id) REFERENCES crop(id))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS harvest (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,crop_id INTEGER NOT NULL, quantity INTEGER NOT NULL, unit TEXT NOT NULL, storage_type TEXT NOT NULL, quality_grade TEXT NOT NULL, planting_date DATE NOT NULL, harvest_date DATE NOT NULL, market_price_mwk INTEGER, date_recorded DATETIME NOT NULL, date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(crop_id) REFERENCES crop(id))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS weather_cache id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, field_id INTEGER NOT NULL, location TEXT NOT NULL, temperature_celsius INTEGER NOT NULL,rainfall_mm INTEGER NOT NULL, wind_speed INTEGER NOT NULL, humidity INTEGER NOT NULL, date_recorded DATETIME NOT NULL, date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(field_id) REFERENCES field(id))')
    }, function(error) {
        console.error('Initialization Error: ' + error.message);
        alert("Initialization Error! : " + error.message);
    }, function() {
        console.log('Database and Tables Ready!');
        // alert("Database and Tables Ready!");
    });
}, false);