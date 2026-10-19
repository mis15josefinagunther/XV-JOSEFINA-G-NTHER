/* Google Apps Script: guardá este código en la planilla de respuestas.
   En la planilla: Extensiones > Apps Script. Después implementá como Aplicación web,
   ejecutar como tu cuenta y acceso para cualquier persona con el enlace.
*/
function doPost(e) {
  try {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName('Respuestas');
    if (!sheet) sheet = spreadsheet.insertSheet('Respuestas');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Fecha y hora',
        'Nombre y apellido de los integrantes',
        'Confirmación de asistencia',
        'Teléfono',
        'Menú',
        'Alergias o preferencias alimentarias'
      ]);
    }
    var p = (e && e.parameter) ? e.parameter : {};
    sheet.appendRow([
      new Date(),
      p.integrantes || '',
      p.asistencia || '',
      p.telefono || '',
      p.menu || '',
      p.alergias_preferencias || ''
    ]);
    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('ERROR: ' + err.message);
  }
}
