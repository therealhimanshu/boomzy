const LEAD_HEADERS = [
  "Submitted At",
  "First Name",
  "Last Name",
  "Email",
  "Website",
  "City / Region",
  "Monthly Budget",
  "Enquiry Message",
  "Source",
  "Page",
  "Country",
  "User Agent"
];

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    verifySecret_(payload.secret);

    if (payload.type === "lead") {
      appendLead_(payload);
    } else {
      throw new Error("Unsupported submission type");
    }

    maybeNotify_(payload);
    return json_({ success: true });
  } catch (error) {
    return json_({
      success: false,
      message: error && error.message ? error.message : "Submission failed"
    });
  }
}

function parsePayload_(e) {
  const contents = e && e.postData && e.postData.contents ? e.postData.contents : "";
  if (!contents) throw new Error("Missing request body");
  return JSON.parse(contents);
}

function verifySecret_(receivedSecret) {
  const expectedSecret = PropertiesService.getScriptProperties().getProperty("BOOMZY_SHARED_SECRET");
  if (!expectedSecret) throw new Error("BOOMZY_SHARED_SECRET is not configured");
  if (receivedSecret !== expectedSecret) throw new Error("Unauthorized");
}

function appendLead_(payload) {
  const data = payload.data || {};
  const meta = payload.meta || {};

  withLock_(function () {
    const sheet = getSheet_("Leads", LEAD_HEADERS);
    sheet.appendRow([
      payload.submittedAt || new Date().toISOString(),
      data.firstName || "",
      data.lastName || "",
      data.email || "",
      data.companyWebsite || "",
      data.location || "",
      data.budget || "",
      data.message || "",
      data.source || "",
      meta.page || "",
      meta.ipCountry || "",
      meta.userAgent || ""
    ]);
  });
}

function getSheet_(name, headers) {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("BOOMZY_SHEET_ID");
  if (!spreadsheetId) throw new Error("BOOMZY_SHEET_ID is not configured");

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);

  ensureHeaders_(sheet, headers);

  return sheet;
}

function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
    return;
  }

  const existingHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), headers.length)).getValues()[0];
  const needsUpdate = headers.some(function (header, index) {
    return existingHeaders[index] !== header;
  });

  if (needsUpdate) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function withLock_(callback) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    callback();
  } finally {
    lock.releaseLock();
  }
}

function maybeNotify_(payload) {
  const recipient = PropertiesService.getScriptProperties().getProperty("BOOMZY_NOTIFY_EMAIL");
  if (!recipient) return;

  const data = payload.data || {};
  const subject = "New Boomzy strategy lead";
  const body = [
    "A new lead was captured.",
    "",
    "Name: " + [data.firstName, data.lastName].filter(Boolean).join(" "),
    "Email: " + (data.email || ""),
    "Website: " + (data.companyWebsite || ""),
    "City / Region: " + (data.location || ""),
    "Budget: " + (data.budget || ""),
    "Message: " + (data.message || ""),
    "Source: " + (data.source || "")
  ].join("\n");

  MailApp.sendEmail(recipient, subject, body);
}

function json_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
