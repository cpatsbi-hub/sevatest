// ═══════════════════════════════════════════════════════════
//  SEVA SARATHI – MALAPPURAM
//  Google Apps Script Backend (Code.gs)
//  Paste this in Google Apps Script editor and deploy as Web App
// ═══════════════════════════════════════════════════════════

const SS_ID = '1ap1D70y1SN_mIwRVs1vNvDFrzbMwezohXc8lytMzaXA';
const DEFAULT_PASSWORD = 'Sbi@1234';

// Sheet names
const SH = {
  USERS:      'Users',
  ATTENDANCE: 'Attendance',
  REPORTS:    'ServiceReport',
  MASTER:     'MasterData',
  BUDGET:     'Budget',
  HOLIDAYS:   'Holidays'
};

// Master data to seed on first run
const INITIAL_MASTER = [
  ['MALAPPURAM','ANJALI K','SS001'],
  ['KOTTAKKAL','ASWATHY M K','SS002'],
  ['PUTHANATHANI','GOPIKA','SS003'],
  ['PULAMANTHOLE','ATHIRA N','SS004'],
  ['VALANCHERRY','ANAGHA M','SS005'],
  ['PERINTHALMANNA','ARATHI ANIL','SS006'],
  ['POOKKOTTUMPADAM','ANOOP','SS007'],
  ['MALAPPURAM CIVIL STATION','AJMAL','SS008'],
  ['KARUVARAKUNDU','NANDHANA A','SS009'],
  ['NRI TIRUR','VINITHA M','SS010'],
  ['MANIMOOLY','SANJAY P S','SS011'],
  ['WANDOOR','PRASANTH K','SS012'],
  ['TIRUR','ASWATHY S K','SS013'],
  ['PANG SOUTH PANG','SARANYA T','SS014'],
  ['EDAPPAL TOWN','ASHEEN','SS015'],
  ['PONNANI','ASWATHY A K','SS016'],
  ['EDAKKARA','RUKSANA THASNI K H','SS017'],
  ['PANDIKKAD','SRUTHI P V','SS018'],
  ['CHANGARAMKULAM','SINDHU','SS019'],
  ['KUTTIPURAM','ASHA KRISHNAN K P','SS020'],
  ['MANJERI','SRUTHI K M','SS021'],
  ['MELATTUR','MOHAMAD SHAHEER KALATHINGAL THODI','SS022']
];

// ═══════════════════════════════════════
//  ENTRY POINTS
// ═══════════════════════════════════════

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      payload = e.parameter;
    }
    
    const action = payload.action || '';
    let result = {};
    
    switch(action) {
      // ── User actions ──
      case 'login':            result = login(payload); break;
      case 'validateSession':  result = validateSession(payload); break;
      case 'changePassword':   result = changePassword(payload); break;
      case 'markAttendance':   result = markAttendance(payload); break;
      case 'getAttendance':    result = getAttendance(payload); break;
      case 'submitReport':     result = submitReport(payload); break;
      case 'getReport':        result = getReport(payload); break;
      case 'getBudget':        result = getBudget(payload); break;
      case 'getMasterData':    result = getMasterData(); break;
      
      // ── Admin actions ──
      case 'admin_getAttendance':   result = admin_getAttendance(payload); break;
      case 'admin_getReports':      result = admin_getReports(payload); break;
      case 'admin_getMasterData':   result = admin_getMasterData(); break;
      case 'admin_addBranch':       result = admin_addBranch(payload); break;
      case 'admin_removeBranch':    result = admin_removeBranch(payload); break;
      case 'admin_getBudgets':      result = admin_getBudgets(payload); break;
      case 'admin_saveBudgets':     result = admin_saveBudgets(payload); break;
      case 'admin_getHolidays':     result = admin_getHolidays(); break;
      case 'admin_addHoliday':      result = admin_addHoliday(payload); break;
      case 'admin_removeHoliday':   result = admin_removeHoliday(payload); break;
      case 'admin_getEfficiency':   result = admin_getEfficiency(payload); break;
      case 'admin_getUsers':        result = admin_getUsers(); break;
      case 'admin_resetPassword':   result = admin_resetPassword(payload); break;
      
      // ── Setup ──
      case 'setup':                 result = setupSheets(); break;
      
      default:
        result = {success: false, error: 'Unknown action: ' + action};
    }
    
    const output = ContentService.createTextOutput(JSON.stringify(result));
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
    
  } catch(err) {
    const output = ContentService.createTextOutput(
      JSON.stringify({success: false, error: err.toString()})
    );
    output.setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}

// ═══════════════════════════════════════
//  SHEET HELPERS
// ═══════════════════════════════════════

function getSheet(name) {
  const ss = SpreadsheetApp.openById(SS_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    initSheet(sheet, name);
  }
  return sheet;
}

function initSheet(sheet, name) {
  switch(name) {
    case SH.USERS:
      sheet.appendRow(['EmpCode','Branch','Name','Password','FirstLogin','Active']);
      // Seed all users
      INITIAL_MASTER.forEach(m => {
        sheet.appendRow([m[2], m[0], m[1], DEFAULT_PASSWORD, true, true]);
      });
      break;
    case SH.ATTENDANCE:
      sheet.appendRow(['Date','EmpCode','Branch','Name','Status','Timestamp']);
      break;
    case SH.REPORTS:
      sheet.appendRow(['Date','EmpCode','Branch','Name',
        'p1','p2','p3','p4','p5','p6','p7','p8',
        'p9','p10','p11','p12','p13','p14','p15','p16',
        'Score','Timestamp']);
      break;
    case SH.MASTER:
      sheet.appendRow(['Branch','Name','EmpCode']);
      INITIAL_MASTER.forEach(m => sheet.appendRow(m));
      break;
    case SH.BUDGET:
      sheet.appendRow(['Branch','Month',
        'p1','p2','p3','p4','p5','p6','p7','p8',
        'p9','p10','p11','p12','p13','p14','p15','p16']);
      break;
    case SH.HOLIDAYS:
      sheet.appendRow(['Date','Description']);
      break;
  }
}

function getSheetData(name) {
  const sheet = getSheet(name);
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0].map(h => String(h).trim());
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function formatDate(d) {
  if (!d) return '';
  if (typeof d === 'string') return d;
  return Utilities.formatDate(new Date(d), 'Asia/Kolkata', 'yyyy-MM-dd');
}

function now() {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
}

// ═══════════════════════════════════════
//  AUTH
// ═══════════════════════════════════════

function login(p) {
  const { empCode, password } = p;
  if (!empCode || !password) return {success: false, error: 'Missing credentials'};
  
  const users = getSheetData(SH.USERS);
  const user = users.find(u => String(u.EmpCode).trim().toUpperCase() === empCode.trim().toUpperCase());
  
  if (!user) return {success: false, error: 'Employee code not found'};
  if (!user.Active) return {success: false, error: 'Account inactive'};
  if (String(user.Password) !== password) return {success: false, error: 'Incorrect password'};
  
  return {
    success: true,
    name: user.Name,
    branch: user.Branch,
    empCode: user.EmpCode,
    firstLogin: user.FirstLogin === true || user.FirstLogin === 'TRUE' || user.Password === DEFAULT_PASSWORD
  };
}

function validateSession(p) {
  const { empCode } = p;
  if (!empCode) return {success: false};
  const users = getSheetData(SH.USERS);
  const user = users.find(u => String(u.EmpCode).trim().toUpperCase() === empCode.trim().toUpperCase());
  if (!user || !user.Active) return {success: false};
  return {success: true, name: user.Name, branch: user.Branch};
}

function changePassword(p) {
  const { empCode, oldPassword, newPassword } = p;
  if (!empCode || !oldPassword || !newPassword) return {success: false, error: 'Missing data'};
  if (newPassword === DEFAULT_PASSWORD) return {success: false, error: 'New password cannot be the default'};
  if (newPassword.length < 6) return {success: false, error: 'Password too short'};
  
  const sheet = getSheet(SH.USERS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toUpperCase() === empCode.trim().toUpperCase()) {
      if (String(data[i][3]) !== oldPassword) return {success: false, error: 'Current password incorrect'};
      sheet.getRange(i+1, 4).setValue(newPassword); // Password column
      sheet.getRange(i+1, 5).setValue(false);        // FirstLogin column
      return {success: true};
    }
  }
  return {success: false, error: 'User not found'};
}

// ═══════════════════════════════════════
//  ATTENDANCE
// ═══════════════════════════════════════

function markAttendance(p) {
  const { empCode, branch, name, status, date } = p;
  if (!empCode || !status || !date) return {success: false, error: 'Missing data'};
  
  // Check if already marked today
  const existing = getSheetData(SH.ATTENDANCE).find(
    r => String(r.EmpCode).trim().toUpperCase() === empCode.trim().toUpperCase() 
      && formatDate(r.Date) === date
  );
  if (existing) return {success: false, error: 'Attendance already marked for today'};
  
  getSheet(SH.ATTENDANCE).appendRow([date, empCode, branch, name, status, now()]);
  return {success: true};
}

function getAttendance(p) {
  const { empCode, date } = p;
  if (!empCode || !date) return {success: false, error: 'Missing data'};
  
  const records = getSheetData(SH.ATTENDANCE);
  const record = records.find(
    r => String(r.EmpCode).trim().toUpperCase() === empCode.trim().toUpperCase()
      && formatDate(r.Date) === date
  );
  
  if (record) return {success: true, status: record.Status};
  return {success: true, status: null};
}

// ═══════════════════════════════════════
//  SERVICE REPORTS
// ═══════════════════════════════════════

function submitReport(p) {
  const { empCode, branch, name, date, values, score } = p;
  if (!empCode || !date) return {success: false, error: 'Missing data'};
  
  // Check if already submitted today
  const existing = getSheetData(SH.REPORTS).find(
    r => String(r.EmpCode).trim().toUpperCase() === empCode.trim().toUpperCase()
      && formatDate(r.Date) === date
  );
  if (existing) return {success: false, error: 'Report already submitted for today'};
  
  // Check if marked present
  const attRecord = getSheetData(SH.ATTENDANCE).find(
    r => String(r.EmpCode).trim().toUpperCase() === empCode.trim().toUpperCase()
      && formatDate(r.Date) === date
  );
  if (!attRecord || attRecord.Status !== 'Present') {
    return {success: false, error: 'Must be marked Present to submit report'};
  }
  
  const v = values || {};
  getSheet(SH.REPORTS).appendRow([
    date, empCode, branch, name,
    v.p1||0, v.p2||0, v.p3||0, v.p4||0, v.p5||0, v.p6||0, v.p7||0, v.p8||0,
    v.p9||0, v.p10||0, v.p11||0, v.p12||0, v.p13||0, v.p14||0, v.p15||0, v.p16||0,
    score||0, now()
  ]);
  return {success: true};
}

function getReport(p) {
  const { empCode, date } = p;
  if (!empCode || !date) return {success: false, error: 'Missing data'};
  
  const records = getSheetData(SH.REPORTS);
  const record = records.find(
    r => String(r.EmpCode).trim().toUpperCase() === empCode.trim().toUpperCase()
      && formatDate(r.Date) === date
  );
  
  if (record) return {success: true, submitted: true, score: record.Score};
  return {success: true, submitted: false};
}

// ═══════════════════════════════════════
//  BUDGET
// ═══════════════════════════════════════

function getBudget(p) {
  const { branch, month } = p;
  if (!branch || !month) return {success: true, budget: {}};
  
  const records = getSheetData(SH.BUDGET);
  const record = records.find(r => r.Branch === branch && r.Month === month);
  
  if (!record) return {success: true, budget: {}};
  
  const budget = {};
  ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14','p15','p16'].forEach(k => {
    budget[k] = record[k] || 0;
  });
  return {success: true, budget};
}

function getMasterData() {
  const records = getSheetData(SH.MASTER);
  return {
    success: true,
    data: records.map(r => ({branch: r.Branch, name: r.Name, empCode: r.EmpCode}))
  };
}

// ═══════════════════════════════════════
//  ADMIN FUNCTIONS
// ═══════════════════════════════════════

function admin_getAttendance(p) {
  const { date } = p;
  if (!date) return {success: false, error: 'Missing date'};
  
  const records = getSheetData(SH.ATTENDANCE).filter(r => formatDate(r.Date) === date);
  return {
    success: true,
    data: records.map(r => ({
      empCode: r.EmpCode,
      name: r.Name,
      branch: r.Branch,
      status: r.Status,
      timestamp: r.Timestamp
    }))
  };
}

function admin_getReports(p) {
  const { date, month, mode } = p;
  let records = getSheetData(SH.REPORTS);
  
  if (mode === 'daily' && date) {
    records = records.filter(r => formatDate(r.Date) === date);
  } else if (mode === 'monthly' && month) {
    records = records.filter(r => formatDate(r.Date).startsWith(month));
  }
  
  // For monthly, aggregate by user
  if (mode === 'monthly') {
    const agg = {};
    records.forEach(r => {
      const key = r.EmpCode;
      if (!agg[key]) {
        agg[key] = {
          empCode: r.EmpCode, name: r.Name, branch: r.Branch,
          totalScore: 0, reportDays: 0, paramTotals: {}
        };
      }
      agg[key].totalScore += Number(r.Score) || 0;
      agg[key].reportDays++;
      ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14','p15','p16'].forEach(k => {
        agg[key].paramTotals[k] = (agg[key].paramTotals[k]||0) + (Number(r[k])||0);
      });
    });
    return {success: true, data: Object.values(agg).map(u => ({
      ...u, score: u.totalScore,
      values: u.paramTotals
    }))};
  }
  
  return {
    success: true,
    data: records.map(r => {
      const values = {};
      ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14','p15','p16'].forEach(k => {
        values[k] = Number(r[k]) || 0;
      });
      return {empCode: r.EmpCode, name: r.Name, branch: r.Branch, score: Number(r.Score)||0, values};
    })
  };
}

function admin_getMasterData() {
  const records = getSheetData(SH.MASTER);
  return {
    success: true,
    data: records.map(r => ({branch: r.Branch, name: r.Name, empCode: r.EmpCode}))
  };
}

function admin_addBranch(p) {
  const { branch, name, empCode } = p;
  if (!branch || !name || !empCode) return {success: false, error: 'Missing data'};
  
  // Check duplicate
  const existing = getSheetData(SH.MASTER).find(r =>
    String(r.EmpCode).toUpperCase() === empCode.toUpperCase()
  );
  if (existing) return {success: false, error: 'Employee code already exists'};
  
  getSheet(SH.MASTER).appendRow([branch, name, empCode]);
  // Also add to users with default password
  getSheet(SH.USERS).appendRow([empCode, branch, name, DEFAULT_PASSWORD, true, true]);
  return {success: true};
}

function admin_removeBranch(p) {
  const { empCode } = p;
  if (!empCode) return {success: false, error: 'Missing empCode'};
  
  const masterSheet = getSheet(SH.MASTER);
  const data = masterSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][2]).toUpperCase() === empCode.toUpperCase()) {
      masterSheet.deleteRow(i+1);
      break;
    }
  }
  
  // Mark user inactive
  const userSheet = getSheet(SH.USERS);
  const userData = userSheet.getDataRange().getValues();
  for (let i = 1; i < userData.length; i++) {
    if (String(userData[i][0]).toUpperCase() === empCode.toUpperCase()) {
      userSheet.getRange(i+1, 6).setValue(false);
      break;
    }
  }
  return {success: true};
}

function admin_getBudgets(p) {
  const { month } = p;
  if (!month) return {success: true, data: {}};
  
  const records = getSheetData(SH.BUDGET).filter(r => r.Month === month);
  const data = {};
  records.forEach(r => {
    const budg = {};
    ['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','p14','p15','p16'].forEach(k => {
      budg[k] = Number(r[k]) || 0;
    });
    data[r.Branch] = budg;
  });
  return {success: true, data};
}

function admin_saveBudgets(p) {
  const { month, data } = p;
  if (!month || !data) return {success: false, error: 'Missing data'};
  
  const sheet = getSheet(SH.BUDGET);
  const sheetData = sheet.getDataRange().getValues();
  
  Object.entries(data).forEach(([branch, budg]) => {
    // Find existing row
    let rowIdx = -1;
    for (let i = 1; i < sheetData.length; i++) {
      if (sheetData[i][0] === branch && sheetData[i][1] === month) {
        rowIdx = i + 1;
        break;
      }
    }
    const rowData = [branch, month,
      budg.p1||0, budg.p2||0, budg.p3||0, budg.p4||0, budg.p5||0, budg.p6||0, budg.p7||0, budg.p8||0,
      budg.p9||0, budg.p10||0, budg.p11||0, budg.p12||0, budg.p13||0, budg.p14||0, budg.p15||0, budg.p16||0
    ];
    if (rowIdx > 0) {
      sheet.getRange(rowIdx, 1, 1, rowData.length).setValues([rowData]);
    } else {
      sheet.appendRow(rowData);
    }
  });
  return {success: true};
}

function admin_getHolidays() {
  const records = getSheetData(SH.HOLIDAYS);
  return {
    success: true,
    data: records.map(r => ({date: formatDate(r.Date), desc: r.Description}))
  };
}

function admin_addHoliday(p) {
  const { date, desc } = p;
  if (!date || !desc) return {success: false, error: 'Missing data'};
  
  const existing = getSheetData(SH.HOLIDAYS).find(r => formatDate(r.Date) === date);
  if (existing) return {success: false, error: 'Holiday already exists for this date'};
  
  getSheet(SH.HOLIDAYS).appendRow([date, desc]);
  return {success: true};
}

function admin_removeHoliday(p) {
  const { date } = p;
  if (!date) return {success: false, error: 'Missing date'};
  
  const sheet = getSheet(SH.HOLIDAYS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (formatDate(data[i][0]) === date) {
      sheet.deleteRow(i+1);
      return {success: true};
    }
  }
  return {success: false, error: 'Holiday not found'};
}

function admin_getEfficiency(p) {
  const { month } = p;
  if (!month) return {success: false, error: 'Missing month'};
  
  const reportsRes = admin_getReports({month, mode: 'monthly'});
  return {success: true, data: reportsRes.data || []};
}

function admin_getUsers() {
  const records = getSheetData(SH.USERS);
  return {
    success: true,
    data: records.map(r => ({
      empCode: r.EmpCode,
      name: r.Name,
      branch: r.Branch,
      firstLogin: r.FirstLogin === true || r.FirstLogin === 'TRUE',
      active: r.Active !== false && r.Active !== 'FALSE'
    })).filter(u => u.active)
  };
}

function admin_resetPassword(p) {
  const { empCode, newPassword } = p;
  if (!empCode || !newPassword) return {success: false, error: 'Missing data'};
  
  const sheet = getSheet(SH.USERS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]).toUpperCase() === empCode.toUpperCase()) {
      sheet.getRange(i+1, 4).setValue(newPassword);
      sheet.getRange(i+1, 5).setValue(true); // Reset firstLogin flag
      return {success: true};
    }
  }
  return {success: false, error: 'User not found'};
}

// ═══════════════════════════════════════
//  SETUP (Run once manually)
// ═══════════════════════════════════════

function setupSheets() {
  const sheetNames = Object.values(SH);
  const ss = SpreadsheetApp.openById(SS_ID);
  sheetNames.forEach(name => {
    if (!ss.getSheetByName(name)) {
      const sheet = ss.insertSheet(name);
      initSheet(sheet, name);
    }
  });
  return {success: true, message: 'All sheets initialized'};
}

// Run this manually once from Apps Script editor
function initialSetup() {
  setupSheets();
  Logger.log('Setup complete!');
}
