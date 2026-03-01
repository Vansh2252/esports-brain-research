// ============================================================
//  GOOGLE APPS SCRIPT — Paste this into your Google Sheet's
//  Apps Script editor (Extensions → Apps Script)
//
//  This receives experiment data and writes it to the sheet.
// ============================================================

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var payload = JSON.parse(e.postData.contents);
        var rows = payload.data;
        var timestamp = payload.timestamp;

        if (!rows || rows.length === 0) {
            return ContentService.createTextOutput(
                JSON.stringify({ status: 'error', message: 'No data received' })
            ).setMimeType(ContentService.MimeType.JSON);
        }

        // Write headers if sheet is empty
        if (sheet.getLastRow() === 0) {
            var headers = Object.keys(rows[0]);
            headers.unshift('submission_timestamp');
            sheet.appendRow(headers);
        }

        // Get existing headers to maintain column order
        var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

        // Write each row of data
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var rowData = headers.map(function (header) {
                if (header === 'submission_timestamp') return timestamp;
                var value = row[header];
                // Convert objects/arrays to JSON strings
                if (typeof value === 'object' && value !== null) {
                    return JSON.stringify(value);
                }
                return value !== undefined ? value : '';
            });
            sheet.appendRow(rowData);
        }

        return ContentService.createTextOutput(
            JSON.stringify({ status: 'success', rowsAdded: rows.length })
        ).setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(
            JSON.stringify({ status: 'error', message: error.toString() })
        ).setMimeType(ContentService.MimeType.JSON);
    }
}

// Required for CORS preflight
function doGet(e) {
    return ContentService.createTextOutput(
        JSON.stringify({ status: 'ok', message: 'Esports Brain Research data endpoint' })
    ).setMimeType(ContentService.MimeType.JSON);
}
