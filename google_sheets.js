// ============================================================
//  GOOGLE SHEETS DATA SUBMISSION
//  Sends experiment data to a Google Sheet via Apps Script
//  
//  SETUP INSTRUCTIONS:
//  1. Create a new Google Sheet
//  2. Go to Extensions → Apps Script
//  3. Paste the code from google_apps_script.js
//  4. Deploy as Web App (access: "Anyone")
//  5. Copy the deployment URL and paste it below
// ============================================================

// ⬇️ PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE ⬇️
var GOOGLE_SHEET_URL = '';
// Example: 'https://script.google.com/macros/s/AKfycbx.../exec'

/**
 * Send all experiment data to Google Sheets.
 * Falls back to CSV download if the URL is not set or request fails.
 */
function sendToGoogleSheets(data) {

    if (!GOOGLE_SHEET_URL) {
        console.warn('Google Sheets URL not configured. Falling back to CSV download.');
        return Promise.reject('No URL configured');
    }

    // Convert jsPsych data to a flat array of objects
    var rows = data.values();

    return fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            data: rows,
            timestamp: new Date().toISOString()
        })
    }).then(function () {
        console.log('Data sent to Google Sheets successfully.');
    });
}
