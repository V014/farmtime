-- 1. User Management
CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT, -- enum handled as text
    date_registered DATETIME DEFAULT,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    biography TEXT,
    contact INTEGER,
    address TEXT,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- 2. Land Organization
CREATE TABLE Field (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    field_name TEXT NOT NULL,
    area_size INTEGER,
    location TEXT,
    area_unit TEXT, -- e.g., 'Hectares', 'Acres'
    soil_type TEXT, -- enum handled as text
    tenure_type TEXT, -- e.g., 'Customary', 'Leasehold'
    date_recorded DATETIME DEFAULT,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE plot (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id INTEGER NOT NULL,
    plot_name TEXT,
    area_size INTEGER,
    area_unit TEXT,
    date_recorded DATETIME DEFAULT,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES Field(id) ON DELETE CASCADE
);

-- 3. Crops and Varieties
CREATE TABLE crop_variety (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_name TEXT NOT NULL,
    crop_variety TEXT,
    availability TEXT, -- enum
    date_recorded DATETIME DEFAULT CURRENT_TIMESTAMP,
    pH_requirement INTEGER,
    temperature_celsius INTEGER,
    rainfall_mm INTEGER,
    season_requirement TEXT,
    maturity_rate INTEGER, -- Days to harvest
    yield_estimate INTEGER,
    yield_unit TEXT,
    treatment TEXT,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE supplier (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    supplier_name TEXT NOT NULL,
    contact INTEGER,
    address TEXT,
    date_registered DATE DEFAULT CURRENT_DATE
);

CREATE TABLE crop (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plot_id INTEGER NOT NULL,
    crop_variety_id INTEGER NOT NULL,
    supplier_id INTEGER,
    crop_type TEXT, -- enum
    intercropping TEXT, -- enum
    batch_id TEXT,
    growth_stage TEXT, -- enum
    status TEXT, -- enum
    date_registered DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_id) REFERENCES plot(id),
    FOREIGN KEY (crop_variety_id) REFERENCES crop_variety(id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(id)
);

-- 4. Farm Activities and Recommendations
CREATE TABLE activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_id INTEGER NOT NULL,
    activity_type TEXT, -- enum
    labor_type TEXT, -- e.g., 'Family', 'Ganyu'
    cost_mwk INTEGER,
    input_quantity INTEGER,
    input_unit TEXT,
    date_recorded DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crop(id) ON DELETE CASCADE
);

CREATE TABLE recommendation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    crop_id INTEGER NOT NULL,
    remarks TEXT,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (crop_id) REFERENCES crop(id)
);

-- 5. Harvest and Weather
CREATE TABLE harvest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_id INTEGER NOT NULL,
    quantity INTEGER,
    unit TEXT, -- e.g., '50kg Bag'
    storage_type TEXT,
    quality_grade TEXT,
    planting_date DATE,
    harvest_date DATE,
    market_price_mwk INTEGER,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crop(id)
);

CREATE TABLE weather_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_id INTEGER NOT NULL,
    location TEXT,
    temperature_celsius INTEGER,
    rainfall_mm INTEGER,
    wind_speed INTEGER,
    humidity INTEGER,
    date_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES Field(id) ON DELETE CASCADE
);