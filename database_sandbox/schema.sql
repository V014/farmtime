-- 1. User Management
CREATE TABLE user (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL, -- enum handled as text
    date_registered DATETIME NOT NULL,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profile (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    biography TEXT,
    contact INTEGER NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 2. Land Organization
CREATE TABLE Field (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    field_name TEXT NOT NULL,
    area_size INTEGER NOT NULL,
    location TEXT NOT NULL,
    area_unit TEXT NOT NULL, -- e.g., 'Hectares', 'Acres'
    soil_type TEXT NOT NULL, -- enum handled as text
    tenure_type TEXT NOT NULL, -- e.g., 'Customary', 'Leasehold'
    date_recorded DATETIME NOT NULL,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE plot (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    field_id INTEGER NOT NULL,
    plot_name TEXT NOT NULL,
    area_size INTEGER NOT NULL,
    area_unit TEXT NOT NULL, -- e.g., 'Square meters', 'Acres'
    date_recorded DATETIME NOT NULL,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES Field(id) ON DELETE CASCADE
);

-- 3. Crops and Varieties
CREATE TABLE crop_variety (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    crop_name TEXT NOT NULL,
    crop_variety TEXT NOT NULL,
    availability TEXT NOT NULL, -- enum
    pH_min REAL,
    pH_max REAL,
    temp_min INTEGER,
    temp_max INTEGER,
    rainfall_min_mm INTEGER,
    rainfall_max_mm INTEGER,
    season_requirement TEXT NOT NULL, -- enum
    maturity_rate INTEGER, -- Days to harvest
    yield_estimate INTEGER,
    yield_unit TEXT, -- e.g., 'kg per hectare'
    common_pests TEXT,
    common_diseases TEXT,
    soil_type TEXT NOT NULL, -- enum
    fertilizer_recommendation TEXT,
    irrigation_needs TEXT NOT NULL, -- enum
    planting_distance TEXT NOT NULL, -- e.g., '30cm x 30cm'
    date_recorded DATETIME NOT NULL,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    supplier_name TEXT NOT NULL,
    contact INTEGER  NOT NULL,
    address TEXT  NOT NULL,
    date_registered DATETIME NOT NULL,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crop (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    plot_id INTEGER NOT NULL,
    crop_variety_id INTEGER NOT NULL,
    supplier_id INTEGER,
    crop_type TEXT NOT NULL, -- enum
    intercropping TEXT NOT NULL, -- enum
    batch_id TEXT,
    growth_stage TEXT NOT NULL, -- enum
    status TEXT NOT NULL, -- enum
    date_registered DATETIME NOT NULL,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_id) REFERENCES plot(id),
    FOREIGN KEY (crop_variety_id) REFERENCES crop_variety(id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(id)
);

-- 4. Farm Activities and Recommendations
CREATE TABLE activity (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    crop_id INTEGER NOT NULL,
    activity_type TEXT NOT NULL, -- enum
    labor_type TEXT NOT NULL, -- e.g., 'Family', 'Ganyu'
    cost_mwk INTEGER,
    input_quantity INTEGER,
    input_unit TEXT NOT NULL,
    date_recorded DATETIME NOT NULL,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crop(id) ON DELETE CASCADE
);

CREATE TABLE recommendation (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    crop_id INTEGER NOT NULL,
    remarks TEXT,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (crop_id) REFERENCES crop(id)
);

-- 5. Harvest and Weather
CREATE TABLE harvest (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    crop_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit TEXT NOT NULL, -- e.g., '50kg Bag'
    storage_type TEXT NOT NULL,
    quality_grade TEXT NOT NULL,
    planting_date DATE NOT NULL,
    harvest_date DATE NOT NULL,
    market_price_mwk INTEGER,
    date_recorded DATETIME NOT NULL,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crop(id)
);

CREATE TABLE weather_cache (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    field_id INTEGER NOT NULL,
    location TEXT NOT NULL,
    temperature_celsius INTEGER NOT NULL,
    rainfall_mm INTEGER NOT NULL,
    wind_speed INTEGER NOT NULL,
    humidity INTEGER NOT NULL,
    date_recorded DATETIME NOT NULL,
    date_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES Field(id) ON DELETE CASCADE
);