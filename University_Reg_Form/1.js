/* ══════════════════════════════════════════
   University Course Registration — script.js
══════════════════════════════════════════ */

/* ────────────────────────────────────────────
   COURSE DATA
──────────────────────────────────────────── */
const allCourses = {
  "Computer Science & Engineering": [
    { code: "CSE301", name: "Data Structures",    credits: 3 },
    { code: "CSE302", name: "Algorithms",          credits: 3 },
    { code: "CSE303", name: "Database Systems",    credits: 3 },
    { code: "CSE304", name: "Operating Systems",   credits: 3 },
    { code: "CSE305", name: "Computer Networks",   credits: 3 },
    { code: "CSE401", name: "Machine Learning",    credits: 3 },
    { code: "CSE402", name: "Software Engineering",credits: 3 },
    { code: "CSE490", name: "Thesis / Capstone",   credits: 6 },
  ],
  "Electrical Engineering": [
    { code: "EEE301", name: "Circuit Analysis",  credits: 3 },
    { code: "EEE302", name: "Signals & Systems",  credits: 3 },
    { code: "EEE303", name: "Microprocessors",    credits: 3 },
    { code: "EEE304", name: "Power Systems",      credits: 3 },
    { code: "EEE305", name: "Control Systems",    credits: 3 },
    { code: "EEE490", name: "Design Project",     credits: 6 },
  ],
  "Business Administration": [
    { code: "BBA301", name: "Marketing Management", credits: 3 },
    { code: "BBA302", name: "Financial Accounting",  credits: 3 },
    { code: "BBA303", name: "Business Law",          credits: 3 },
    { code: "BBA304", name: "Operations Mgmt",       credits: 3 },
    { code: "BBA305", name: "Strategic Management",  credits: 3 },
    { code: "BBA490", name: "Business Research",     credits: 6 },
  ],
  "English Literature": [
    { code: "ENG301", name: "Modern Fiction",      credits: 3 },
    { code: "ENG302", name: "Poetry & Poetics",    credits: 3 },
    { code: "ENG303", name: "Linguistics",         credits: 3 },
    { code: "ENG304", name: "Postcolonial Lit.",   credits: 3 },
    { code: "ENG490", name: "Dissertation",        credits: 6 },
  ],
  "Law & Justice": [
    { code: "LAW301", name: "Constitutional Law",  credits: 3 },
    { code: "LAW302", name: "Criminal Law",        credits: 3 },
    { code: "LAW303", name: "Contract Law",        credits: 3 },
    { code: "LAW304", name: "International Law",   credits: 3 },
    { code: "LAW490", name: "Moot Court Project",  credits: 6 },
  ],
  "Pharmacy": [
    { code: "PHM301", name: "Pharmacology I",      credits: 3 },
    { code: "PHM302", name: "Medicinal Chemistry", credits: 3 },
    { code: "PHM303", name: "Pharmaceutics",       credits: 3 },
    { code: "PHM304", name: "Clinical Pharmacy",   credits: 3 },
    { code: "PHM490", name: "Research Thesis",     credits: 6 },
  ],
};

let selectedCourses = {};

/* ────────────────────────────────────────────
   COURSE RENDERING & SELECTION
──────────────────────────────────────────── */
function updateCourses() {
  const dept = document.getElementById('department').value;
  const grid = document.getElementById('coursesGrid');
  selectedCourses = {};
  updateCreditDisplay();

  if (!dept) {
    grid.innerHTML = '<p style="color:var(--text-muted);font-size:13px">Please select a department first.</p>';
    return;
  }

  const courses = allCourses[dept] || [];
  grid.innerHTML = courses.map(c => `
    <div class="course-card" id="cc-${c.code}" onclick="toggleCourse('${c.code}',${c.credits},'${c.name}')">
      <input type="checkbox" id="ch-${c.code}"/>
      <div class="course-code">${c.code}</div>
      <div class="course-name">${c.name}</div>
      <div class="course-credits">${c.credits} credits</div>
    </div>`).join('');
}

function toggleCourse(code, credits, name) {
  if (selectedCourses[code]) {
    delete selectedCourses[code];
    document.getElementById('cc-' + code).classList.remove('selected');
  } else {
    const total = Object.values(selectedCourses).reduce((s, c) => s + c.credits, 0);
    if (total + credits > 21) {
      showErr('courseError', 'Maximum 21 credits allowed.');
      return;
    }
    selectedCourses[code] = { credits, name };
    document.getElementById('cc-' + code).classList.add('selected');
  }
  clearErr('courseError');
  updateCreditDisplay();
}

function updateCreditDisplay() {
  const total = Object.values(selectedCourses).reduce((s, c) => s + c.credits, 0);
  document.getElementById('totalCredits').textContent = total;
  const st = document.getElementById('creditStatus');
  if (total === 0) {
    st.textContent = 'Select 9–21 credits';
    st.style.color = 'var(--text-muted)';
  } else if (total < 9) {
    st.textContent = `Need ${9 - total} more credits`;
    st.style.color = 'var(--error)';
  } else {
    st.textContent = '✓ Valid selection';
    st.style.color = 'var(--success)';
  }
}

/* ────────────────────────────────────────────
   PHOTO PREVIEW
──────────────────────────────────────────── */
function previewPhoto(input) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    const prev = document.getElementById('photoPreview');
    prev.innerHTML = `<img src="${e.target.result}" alt="photo"/>`;
  };
  reader.readAsDataURL(input.files[0]);
}

/* ────────────────────────────────────────────
   RADIO / CHECKBOX HELPERS
──────────────────────────────────────────── */
function selectRadio(label, name) {
  document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
    r.closest('.radio-btn')?.classList.remove('sel');
  });
  label.classList.add('sel');
  label.querySelector('input').checked = true;
  clearErr(name + 'Err');
}

function toggleCheck(label, id) {
  const cb = document.getElementById(id);
  label.classList.toggle('sel');
  cb.checked = !cb.checked;
  clearErr(id + 'Err');
}

/* ────────────────────────────────────────────
   PASSWORD HELPERS
──────────────────────────────────────────── */
function togglePw(id, btn) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

function updateStrength() {
  const pw = document.getElementById('password').value;
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  const colors = ['var(--error)', '#e07a30', '#e0c030', 'var(--success)'];
  for (let i = 1; i <= 4; i++) {
    document.getElementById('s' + i).style.background =
      i <= score ? colors[score - 1] : 'var(--border)';
  }
}

/* ────────────────────────────────────────────
   VALIDATION RULES
──────────────────────────────────────────── */
const rules = {
  firstName:        v => v.trim().length < 2  ? 'First name must be at least 2 characters.' : '',
  lastName:         v => v.trim().length < 2  ? 'Last name must be at least 2 characters.' : '',
  fatherName:       v => v.trim().length < 2  ? "Father's name is required." : '',
  motherName:       v => v.trim().length < 2  ? "Mother's name is required." : '',
  dob: v => {
    if (!v) return 'Date of birth is required.';
    const age = (new Date() - new Date(v)) / 31557600000;
    if (age < 16) return 'Must be at least 16 years old.';
    if (age > 60) return 'Please enter a valid date of birth.';
    return '';
  },
  gender:           v => !v ? 'Please select a gender.' : '',
  nationalId:       v => v.trim().length < 5  ? 'Enter a valid national ID or passport number.' : '',
  nationality:      v => !v ? 'Please select a nationality.' : '',
  email:            v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.',
  phone:            v => /^[\d\s\+\-]{7,15}$/.test(v.trim()) ? '' : 'Enter a valid phone number.',
  presentAddress:   v => v.trim().length < 8  ? 'Please enter your present address.' : '',
  studentId:        v => v.trim().length < 3  ? 'Enter your student ID.' : '',
  rollNo:           v => v.trim().length < 3  ? 'Enter your roll number.' : '',
  department:       v => !v ? 'Please select your department.' : '',
  program:          v => !v ? 'Please select your degree program.' : '',
  yearOfStudy:      v => !v ? 'Please select your year of study.' : '',
  semester:         v => !v ? 'Please select a semester.' : '',
  enrollType:       v => !v ? 'Please select enrollment type.' : '',
  guardianName:     v => v.trim().length < 2  ? "Guardian's name is required." : '',
  guardianPhone:    v => /^[\d\s\+\-]{7,15}$/.test(v.trim()) ? '' : 'Enter a valid phone number.',
  guardianRelation: v => !v ? 'Please select relation.' : '',
  username:         v => /^[a-zA-Z0-9_]{6,}$/.test(v) ? '' : 'Username must be 6+ alphanumeric characters.',
  uniEmail:         v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid university email.',
  password:         v => v.length < 8 ? 'Password must be at least 8 characters.' : '',
  confirmPw:        v => v !== document.getElementById('password').value ? 'Passwords do not match.' : '',
};

function validate(id) {
  const el = document.getElementById(id);
  if (!el || !rules[id]) return true;
  const err = rules[id](el.value);
  if (err) {
    showErr(id + 'Err', err);
    el.classList.add('error');
    el.classList.remove('valid');
    return false;
  } else {
    clearErr(id + 'Err');
    el.classList.remove('error');
    el.classList.add('valid');
    return true;
  }
}

function showErr(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}

function clearErr(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ''; el.classList.remove('show'); }
}

/* ────────────────────────────────────────────
   STEP NAVIGATION
──────────────────────────────────────────── */
let currentStep = 1;

const panelFields = {
  1: ['firstName','lastName','fatherName','motherName','dob','gender','nationalId','nationality','email','phone','presentAddress'],
  2: ['studentId','rollNo','department','program','yearOfStudy','semester','enrollType','guardianName','guardianPhone','guardianRelation'],
  3: [],
  4: ['username','uniEmail','password','confirmPw'],
};

function validatePanel(step) {
  const fields = panelFields[step];
  let ok = true;
  fields.forEach(f => { if (!validate(f)) ok = false; });

  if (step === 3) {
    const timing = document.querySelector('input[name="timing"]:checked');
    const mode   = document.querySelector('input[name="mode"]:checked');
    if (!timing) { showErr('timingErr', 'Please select a preferred timing.'); ok = false; }
    if (!mode)   { showErr('modeErr',   'Please select a learning mode.'); ok = false; }
    const total  = Object.values(selectedCourses).reduce((s, c) => s + c.credits, 0);
    if (total < 9) { showErr('courseError', 'Please select at least 9 credits worth of courses.'); ok = false; }
  }

  if (step === 4) {
    if (!document.getElementById('agreeTerms').checked) {
      showErr('agreeTermsErr', 'You must agree to the terms to proceed.');
      ok = false;
    }
  }
  return ok;
}

function nextStep(from) {
  if (!validatePanel(from)) return;
  if (from === 3) buildReview();
  goStep(from + 1);
}

function prevStep(from) { goStep(from - 1); }

function goStep(n) {
  document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel' + n).classList.add('active');
  document.querySelectorAll('.progress-step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < n) s.classList.add('done');
    if (i + 1 === n) s.classList.add('active');
  });
  currentStep = n;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ────────────────────────────────────────────
   REVIEW BUILDER
──────────────────────────────────────────── */
function g(id) {
  const el = document.getElementById(id);
  return el ? el.value : '—';
}

function buildReview() {
  const timing     = document.querySelector('input[name="timing"]:checked')?.value || '—';
  const mode       = document.querySelector('input[name="mode"]:checked')?.value   || '—';
  const courseList = Object.entries(selectedCourses)
    .map(([code, { name }]) => `<span class="course-tag">${code} ${name}</span>`)
    .join('');
  const totalCr    = Object.values(selectedCourses).reduce((s, c) => s + c.credits, 0);

  document.getElementById('reviewBlock').innerHTML = `
    <div class="summary-block">
      <h4>👤 Personal Information</h4>
      <div class="summary-row"><span class="summary-key">Full Name</span><span class="summary-val">${g('firstName')} ${g('lastName')}</span></div>
      <div class="summary-row"><span class="summary-key">Date of Birth</span><span class="summary-val">${g('dob')}</span></div>
      <div class="summary-row"><span class="summary-key">Gender</span><span class="summary-val">${g('gender')}</span></div>
      <div class="summary-row"><span class="summary-key">National ID</span><span class="summary-val">${g('nationalId')}</span></div>
      <div class="summary-row"><span class="summary-key">Email</span><span class="summary-val">${g('email')}</span></div>
      <div class="summary-row"><span class="summary-key">Phone</span><span class="summary-val">${g('phone')}</span></div>
      <div class="summary-row"><span class="summary-key">Address</span><span class="summary-val">${g('presentAddress')}</span></div>
    </div>
    <div class="summary-block">
      <h4>🏛 Academic Information</h4>
      <div class="summary-row"><span class="summary-key">Student ID</span><span class="summary-val">${g('studentId')}</span></div>
      <div class="summary-row"><span class="summary-key">Department</span><span class="summary-val">${g('department')}</span></div>
      <div class="summary-row"><span class="summary-key">Program</span><span class="summary-val">${g('program')}</span></div>
      <div class="summary-row"><span class="summary-key">Year / Semester</span><span class="summary-val">${g('yearOfStudy')} · ${g('semester')}</span></div>
      <div class="summary-row"><span class="summary-key">Enrollment</span><span class="summary-val">${g('enrollType')}</span></div>
    </div>
    <div class="summary-block">
      <h4>📚 Course Selection</h4>
      <div class="summary-row"><span class="summary-key">Timing</span><span class="summary-val">${timing}</span></div>
      <div class="summary-row"><span class="summary-key">Mode</span><span class="summary-val">${mode}</span></div>
      <div class="summary-row"><span class="summary-key">Courses</span><span class="summary-val">${courseList || '—'}</span></div>
      <div class="summary-row"><span class="summary-key">Total Credits</span><span class="summary-val">${totalCr}</span></div>
    </div>
  `;
}

/* ────────────────────────────────────────────
   FORM SUBMISSION
──────────────────────────────────────────── */
function submitForm() {
  if (!validatePanel(4)) return;
  const ref = 'REG-' + Date.now().toString(36).toUpperCase().slice(-6);
  document.getElementById('refNumber').textContent = ref;
  document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panelSuccess').classList.add('active');
  document.querySelectorAll('.progress-step').forEach(s => {
    s.classList.remove('active');
    s.classList.add('done');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  location.reload();
}

/* ── Initialise ── */
updateCourses();
