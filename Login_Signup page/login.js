/* ============================================================
   login.js  –  Nexus Login / Sign Up Page
   Features: Tab switch, form validation, password strength,
             eye toggle, real-time feedback, toast alerts
   ============================================================ */

'use strict';

/* ─────────────────────────────────────────
   Utility helpers
───────────────────────────────────────── */

/** Show a brief toast notification */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.className = 'toast';
  }, 3200);
}

/** Mark a field as invalid with a message */
function setFieldError(field, message) {
  field.classList.add('has-error');
  field.classList.remove('is-valid');
  const errEl = field.nextElementSibling;
  if (errEl && errEl.classList.contains('field-error')) {
    errEl.textContent = message;
  }
}

/** Mark a field as valid and clear error */
function setFieldValid(field) {
  field.classList.remove('has-error');
  field.classList.add('is-valid');
  const errEl = field.nextElementSibling;
  if (errEl && errEl.classList.contains('field-error')) {
    errEl.textContent = '';
  }
}

/** Clear a field's state (neither valid nor error) */
function clearFieldState(field) {
  field.classList.remove('has-error', 'is-valid');
  const errEl = field.nextElementSibling;
  if (errEl && errEl.classList.contains('field-error')) {
    errEl.textContent = '';
  }
}

/** Simple email regex validation */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/** Get the .input-box wrapper from any inner element */
function getInputBox(el) {
  return el.closest('.input-box');
}


/* ─────────────────────────────────────────
   Tab switching
───────────────────────────────────────── */
const tabs   = document.querySelectorAll('.tab');
const slider = document.getElementById('tab-slider');
const forms  = {
  login:  document.getElementById('form-login'),
  signup: document.getElementById('form-signup'),
};

function activateTab(tabEl) {
  const target = tabEl.dataset.target;

  // Update tab button states
  tabs.forEach(t => {
    t.classList.toggle('active', t === tabEl);
    t.setAttribute('aria-selected', t === tabEl ? 'true' : 'false');
  });

  // Move slider
  slider.classList.toggle('moved', target === 'signup');

  // Show correct form
  Object.entries(forms).forEach(([key, form]) => {
    form.classList.toggle('active', key === target);
  });

  // Reset both forms' visual states on tab switch
  resetFormVisuals(forms.login);
  resetFormVisuals(forms.signup);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => activateTab(tab));
});

/** Remove all error/valid highlights from a form */
function resetFormVisuals(formEl) {
  formEl.querySelectorAll('.input-box').forEach(box => {
    box.classList.remove('has-error', 'is-valid');
  });
  formEl.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
  });
}


/* ─────────────────────────────────────────
   Password visibility toggle
───────────────────────────────────────── */
document.querySelectorAll('.eye-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input  = document.getElementById(btn.dataset.target);
    const eyeOff = btn.querySelector('.eye-off');
    const eyeOn  = btn.querySelector('.eye-on');
    const show   = input.type === 'password';

    input.type = show ? 'text' : 'password';
    eyeOff.classList.toggle('hidden', show);
    eyeOn.classList.toggle('hidden', !show);
  });
});


/* ─────────────────────────────────────────
   Password strength meter
───────────────────────────────────────── */
const signupPasswordInput = document.getElementById('signup-password');
const strengthFill        = document.getElementById('strength-fill');
const strengthText        = document.getElementById('strength-text');

const strengthLevels = [
  { label: '',       color: 'transparent', pct: '0%'   },
  { label: 'Weak',   color: '#ff6b6b',     pct: '25%'  },
  { label: 'Fair',   color: '#ffa94d',     pct: '55%'  },
  { label: 'Good',   color: '#ffcc70',     pct: '78%'  },
  { label: 'Strong', color: '#5ef0a8',     pct: '100%' },
];

function calcStrength(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8)             score++;
  if (password.length >= 12)            score++;
  if (/[A-Z]/.test(password))           score++;
  if (/[0-9]/.test(password))           score++;
  if (/[^A-Za-z0-9]/.test(password))    score++;
  return Math.min(Math.ceil(score / 1.25), 4); // 0-4
}

signupPasswordInput.addEventListener('input', () => {
  const level = strengthLevels[calcStrength(signupPasswordInput.value)];
  strengthFill.style.width      = level.pct;
  strengthFill.style.background = level.color;
  strengthText.textContent      = level.label;
  strengthText.style.color      = level.color;
});


/* ─────────────────────────────────────────
   Real-time field clearing on user input
───────────────────────────────────────── */
document.querySelectorAll('.input-box input').forEach(input => {
  input.addEventListener('input', () => {
    const box = getInputBox(input);
    if (box.classList.contains('has-error')) {
      clearFieldState(box);
    }
  });
});


/* ─────────────────────────────────────────
   LOGIN form validation
───────────────────────────────────────── */
forms.login.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  const emailInput = document.getElementById('login-email');
  const passInput  = document.getElementById('login-password');
  const emailBox   = getInputBox(emailInput);
  const passBox    = getInputBox(passInput);

  // Email
  if (!emailInput.value.trim()) {
    setFieldError(emailBox, 'Email address is required.');
    valid = false;
  } else if (!isValidEmail(emailInput.value)) {
    setFieldError(emailBox, 'Please enter a valid email address.');
    valid = false;
  } else {
    setFieldValid(emailBox);
  }

  // Password
  if (!passInput.value) {
    setFieldError(passBox, 'Password is required.');
    valid = false;
  } else if (passInput.value.length < 6) {
    setFieldError(passBox, 'Password must be at least 6 characters.');
    valid = false;
  } else {
    setFieldValid(passBox);
  }

  if (!valid) {
    showToast('Please fix the errors and try again.', 'error');
    return;
  }

  // Simulate login success
  const btn = this.querySelector('.btn-primary');
  btn.classList.add('loading');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Signing in…';

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Sign In';
    showToast('✓ Welcome back! Login successful.', 'success');

    // Redirect after toast: window.location.href = 'home.html';
  }, 1500);
});


/* ─────────────────────────────────────────
   SIGNUP form validation
───────────────────────────────────────── */
forms.signup.addEventListener('submit', function (e) {
  e.preventDefault();
  let valid = true;

  const firstInput   = document.getElementById('signup-first');
  const lastInput    = document.getElementById('signup-last');
  const emailInput   = document.getElementById('signup-email');
  const passInput    = document.getElementById('signup-password');
  const confirmInput = document.getElementById('signup-confirm');
  const termsCheck   = document.getElementById('terms');
  const termsError   = document.getElementById('terms-error');

  const firstBox   = getInputBox(firstInput);
  const lastBox    = getInputBox(lastInput);
  const emailBox   = getInputBox(emailInput);
  const passBox    = getInputBox(passInput);
  const confirmBox = getInputBox(confirmInput);

  /* First name */
  if (!firstInput.value.trim() || firstInput.value.trim().length < 2) {
    setFieldError(firstBox, 'Enter at least 2 characters.');
    valid = false;
  } else {
    setFieldValid(firstBox);
  }

  /* Last name */
  if (!lastInput.value.trim() || lastInput.value.trim().length < 2) {
    setFieldError(lastBox, 'Enter at least 2 characters.');
    valid = false;
  } else {
    setFieldValid(lastBox);
  }

  /* Email */
  if (!emailInput.value.trim()) {
    setFieldError(emailBox, 'Email address is required.');
    valid = false;
  } else if (!isValidEmail(emailInput.value)) {
    setFieldError(emailBox, 'Please enter a valid email address.');
    valid = false;
  } else {
    setFieldValid(emailBox);
  }

  /* Password */
  const strength = calcStrength(passInput.value);
  if (!passInput.value) {
    setFieldError(passBox, 'Password is required.');
    valid = false;
  } else if (passInput.value.length < 8) {
    setFieldError(passBox, 'Password must be at least 8 characters.');
    valid = false;
  } else if (strength < 2) {
    setFieldError(passBox, 'Password is too weak. Add numbers or symbols.');
    valid = false;
  } else {
    setFieldValid(passBox);
  }

  /* Confirm password */
  if (!confirmInput.value) {
    setFieldError(confirmBox, 'Please confirm your password.');
    valid = false;
  } else if (confirmInput.value !== passInput.value) {
    setFieldError(confirmBox, 'Passwords do not match.');
    valid = false;
  } else {
    setFieldValid(confirmBox);
  }

  /* Terms */
  if (!termsCheck.checked) {
    termsError.textContent = 'You must accept the Terms of Service to continue.';
    valid = false;
  } else {
    termsError.textContent = '';
  }

  if (!valid) {
    showToast('Please fix the errors and try again.', 'error');
    return;
  }

  /* Simulate account creation */
  const btn = this.querySelector('.btn-primary');
  btn.classList.add('loading');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Creating account…';

  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Create Account';
    showToast('🎉 Account created successfully!', 'success');

    // Redirect: window.location.href = 'home.html';
  }, 1600);
});


/* ─────────────────────────────────────────
   Clear terms error when checkbox is toggled
───────────────────────────────────────── */
document.getElementById('terms').addEventListener('change', () => {
  document.getElementById('terms-error').textContent = '';
});


/* ─────────────────────────────────────────
   Social button placeholder feedback
───────────────────────────────────────── */
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('aria-label') || 'provider';
    showToast(`Connecting with ${name}…`, 'info');
  });
});


/* ─────────────────────────────────────────
   Animated dots on brand panel (auto-cycle)
───────────────────────────────────────── */
const dots = document.querySelectorAll('.brand-dots .dot');
let dotIndex = 0;

if (dots.length) {
  setInterval(() => {
    dots[dotIndex].classList.remove('active');
    dotIndex = (dotIndex + 1) % dots.length;
    dots[dotIndex].classList.add('active');
  }, 2200);
}
