# Farm Time Plantation Advisor
This is a mobile app written in cordova as a school project that uses open weather api 
to pull the current weather and passes on the data to gemini api to provide crops to plant 
according the the details returned.
# Language Base
- HTML
- CSS
- JavaScript
- jQuery
- SQLite

Useful commands
# Remove the platform
cordova platform remove android
# Clean the project cache
cordova clean android
# Add the platform back fresh (this regenerates the Gradle files)
cordova platform add android
# running the app
cordova run android --device
adb connect localhost:6520
# Prepare the project to sync config.xml changes
cordova prepare android
# List all available emulators
cordova emulate android --list
adb devices
# Add the core SQLite plugin
cordova plugin add cordova-sqlite-storage
# Standard debug build
cordova build android
# This will output a lot of text; scroll up to find the "FAILED" section
cordova build android --verbose