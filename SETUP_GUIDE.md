# Seva Sarathi – Complete Setup Guide
## Malappuram Region, State Bank of India

---

## 📁 Files You'll Receive
| File | Purpose |
|------|---------|
| `index.html` | User app (attendance + service report) |
| `admin-seva.html` | Admin portal (secret URL) |
| `Code.gs` | Google Apps Script backend |

---

## 🔧 STEP 1 — Google Apps Script Setup

### 1.1 Open Your Google Sheet
Go to: https://docs.google.com/spreadsheets/d/1ap1D70y1SN_mIwRVs1vNvDFrzbMwezohXc8lytMzaXA

### 1.2 Open Apps Script Editor
- Click **Extensions → Apps Script**
- Delete all existing code in `Code.gs`
- Paste the entire contents of the provided `Code.gs` file
- Click **Save** (💾)

### 1.3 Initialize Sheets (Run Once)
- In the Apps Script editor, select `initialSetup` from the function dropdown
- Click **Run** ▶
- Grant all permissions when prompted
- This creates all required sheets with the 22 branch/user records

### 1.4 Deploy as Web App
- Click **Deploy → New Deployment**
- Type: **Web App**
- Description: `Seva Sarathi API v1`
- Execute as: **Me** (your Google account)
- Who has access: **Anyone**
- Click **Deploy**
- **COPY THE WEB APP URL** — it looks like:
  `https://script.google.com/macros/s/AKfycb.../exec`

---

## 🔧 STEP 2 — Update HTML Files

### 2.1 Replace Script URL in index.html
Open `index.html`, find this line (near top of `<script>` section):
```javascript
const SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';
```
Replace `YOUR_SCRIPT_ID_HERE/exec` with your actual deployed URL.

### 2.2 Do the same in admin-seva.html
Same line at top of `<script>` section — replace with your Apps Script URL.

---

## 🔧 STEP 3 — GitHub Hosting

### 3.1 Create GitHub Repository
1. Go to https://github.com → New Repository
2. Name it: `seva-sarathi-malappuram` (or any name)
3. Make it **Public** (required for GitHub Pages free hosting)
4. Initialize with README ✓

### 3.2 Upload Files
Upload these files to your repository:
- `index.html` → This is the main user app
- `admin-seva.html` → Admin portal (secret page)

### 3.3 Enable GitHub Pages
1. Go to your repository → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. Click **Save**
5. Wait ~2 minutes

### 3.4 Your URLs will be:
- **User App:** `https://YOUR-USERNAME.github.io/seva-sarathi-malappuram/`
- **Admin Portal:** `https://YOUR-USERNAME.github.io/seva-sarathi-malappuram/admin-seva.html`

> ⚠️ Keep the admin URL secret — share only with authorized personnel!

---

## 🔧 STEP 4 — Google Sheet Structure

After `initialSetup` runs, these sheets are created automatically:

### Sheet: `Users`
| EmpCode | Branch | Name | Password | FirstLogin | Active |
|---------|--------|------|----------|------------|--------|
| SS001 | MALAPPURAM | ANJALI K | Sbi@1234 | TRUE | TRUE |
| ... | ... | ... | ... | ... | ... |

> **Passwords are stored here — only you (as Sheet owner) can see them.**

### Sheet: `Attendance`
| Date | EmpCode | Branch | Name | Status | Timestamp |

### Sheet: `ServiceReport`
| Date | EmpCode | Branch | Name | p1 | p2 | ... | p16 | Score | Timestamp |

### Sheet: `Budget`
| Branch | Month | p1 | p2 | ... | p16 |

### Sheet: `Holidays`
| Date | Description |

---

## 🧑‍💼 HOW USERS WORK

### First Login
1. User opens `index.html` on their computer
2. Enter **Employee Code** (SS001–SS022) and **default password: Sbi@1234**
3. System prompts to **change password** immediately
4. New password must be ≥6 chars and cannot be `Sbi@1234`

### Daily Attendance (by 10 AM)
1. Login → Attendance page appears
2. At 10 AM, a browser reminder notification fires (if allowed)
3. Click **Present** or **Absent** → Confirm popup → Submit
4. **Attendance can only be marked ONCE per day per user**

### Service Report (by 4:15 PM)
1. After marking Present, click **Service Report** link
2. Browser reminder fires at 4:15 PM
3. Fill in numbers for each parameter using +/− buttons or keyboard
4. See live score (YS) updating as you type
5. Submit → WhatsApp-formatted message appears → Copy/Share to group
6. **Report can only be submitted once per day**

---

## 👔 HOW ADMIN WORKS

Admin opens `admin-seva.html` — **no login required** (kept secret by URL).

### Features:
1. **Dashboard** — Live counts of present/absent/reports today
2. **Attendance** — Date picker, sorted (Present → Absent → Not Marked), PNG download
3. **Service Reports** — Ranked by score (high → low), Daily/Monthly toggle, Excel & PNG download
4. **Master Data** — Add/remove branches and users
5. **Budget** — Set monthly targets per branch per parameter (UI or CSV upload)
6. **Holidays** — Add custom holidays; 2nd & 4th Saturdays auto-excluded
7. **Efficiency** — Per-user analysis with AI-generated suggestions
8. **User Management** — Reset passwords for users

---

## 📱 EMPLOYEE CODE LIST (Default)

| Code | Branch | Name |
|------|--------|------|
| SS001 | MALAPPURAM | ANJALI K |
| SS002 | KOTTAKKAL | ASWATHY M K |
| SS003 | PUTHANATHANI | GOPIKA |
| SS004 | PULAMANTHOLE | ATHIRA N |
| SS005 | VALANCHERRY | ANAGHA M |
| SS006 | PERINTHALMANNA | ARATHI ANIL |
| SS007 | POOKKOTTUMPADAM | ANOOP |
| SS008 | MALAPPURAM CIVIL STATION | AJMAL |
| SS009 | KARUVARAKUNDU | NANDHANA A |
| SS010 | NRI TIRUR | VINITHA M |
| SS011 | MANIMOOLY | SANJAY P S |
| SS012 | WANDOOR | PRASANTH K |
| SS013 | TIRUR | ASWATHY S K |
| SS014 | PANG SOUTH PANG | SARANYA T |
| SS015 | EDAPPAL TOWN | ASHEEN |
| SS016 | PONNANI | ASWATHY A K |
| SS017 | EDAKKARA | RUKSANA THASNI K H |
| SS018 | PANDIKKAD | SRUTHI P V |
| SS019 | CHANGARAMKULAM | SINDHU |
| SS020 | KUTTIPURAM | ASHA KRISHNAN K P |
| SS021 | MANJERI | SRUTHI K M |
| SS022 | MELATTUR | MOHAMAD SHAHEER KALATHINGAL THODI |

> **Share each user their Employee Code only. They set their own password on first login.**

---

## 🔒 SECURITY MODEL

| What | Where stored | Who can see |
|------|-------------|-------------|
| Passwords | Google Sheet (Users tab) | Sheet owner only |
| Attendance | Google Sheet | Sheet owner + via Admin page |
| Reports | Google Sheet | Sheet owner + via Admin page |
| Admin URL | Not in code | Only who you share it with |

**Passwords are NEVER visible in the HTML files.** They're stored in Google Sheets and verified server-side via Apps Script.

---

## 🛠 TROUBLESHOOTING

**"Invalid credentials" on login**
→ Run `initialSetup` again in Apps Script if sheets are empty

**Data not saving**
→ Make sure Apps Script is deployed with "Anyone" access
→ Check that the SCRIPT_URL in HTML matches your deployed URL

**Notifications not showing**
→ Users must Allow browser notifications when prompted
→ Works in Chrome/Edge; Safari has limited support

**"Apps Script not accessible"**
→ Go to Apps Script → Deploy → Manage Deployments → check status is Active

---

## 📞 TECH SUMMARY

- **Frontend:** Pure HTML/CSS/JS (no frameworks, works offline after load)
- **Backend:** Google Apps Script (serverless, free)
- **Database:** Google Sheets (your existing sheet)
- **Hosting:** GitHub Pages (free, always-on)
- **Notifications:** Browser Notification API
- **WhatsApp:** Uses wa.me deep link with pre-filled message

---

*Built for Seva Sarathi Program, SBI Malappuram Region*
