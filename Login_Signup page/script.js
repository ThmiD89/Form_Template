// DOM Elements
const loginPanel = document.getElementById('loginPanel');
const signupPanel = document.getElementById('signupPanel');
const showSignupBtn = document.getElementById('showSignupBtn');
const showLoginBtn = document.getElementById('showLoginBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const toastMessage = document.getElementById('toastMessage');

// Helper: Show toast notification
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toastMessage.classList.remove('hidden', 'success', 'error');
    toastMessage.classList.add(type);
    
    setTimeout(() => {
        toastMessage.classList.add('hidden');
    }, 3000);
}

// Helper: Clear all error messages inside a form
function clearFormErrors(formElement) {
    const errorDivs = formElement.querySelectorAll('.error-msg');
    errorDivs.forEach(div => div.textContent = '');
    
    const inputs = formElement.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error-input'));
}

// Helper: Display error for a specific field
function setFieldError(inputId, errorDivId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorDivId);
    if (input) input.classList.add('error-input');
    if (errorDiv) errorDiv.textContent = message;
}

// Helper: Clear a specific field error
function clearFieldError(inputId, errorDivId) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorDivId);
    if (input) input.classList.remove('error-input');
    if (errorDiv) errorDiv.textContent = '';
}

// Password strength checker
function checkPasswordStrength(password) {
    const strengthDiv = document.getElementById('passwordStrength');
    if (!strengthDiv) return;
    
    if (!password) {
        strengthDiv.textContent = '';
        return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (password.length < 6) {
        strengthDiv.textContent = '⚠️ Too short';
        strengthDiv.className = 'password-strength strength-weak';
    } else if (strength <= 2) {
        strengthDiv.textContent = '🔑 Weak password';
        strengthDiv.className = 'password-strength strength-weak';
    } else if (strength <= 3) {
        strengthDiv.textContent = '🟡 Medium password';
        strengthDiv.className = 'password-strength strength-medium';
    } else {
        strengthDiv.textContent = '✅ Strong password';
        strengthDiv.className = 'password-strength strength-strong';
    }
}

// ========== PASSWORD VISIBILITY TOGGLE ==========
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            
            if (passwordInput) {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Change eye icon appearance (optional: change SVG path)
                const svg = this.querySelector('.eye-icon');
                if (svg) {
                    if (type === 'text') {
                        // Show "eye with slash" effect - modify SVG path
                        svg.innerHTML = `
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2"/>
                        `;
                    } else {
                        svg.innerHTML = `
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        `;
                    }
                }
            }
        });
    });
}

// Real-time password strength for signup
const signupPasswordInput = document.getElementById('signupPassword');
if (signupPasswordInput) {
    signupPasswordInput.addEventListener('input', (e) => {
        checkPasswordStrength(e.target.value);
    });
}

// Validate email format
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// LOGIN VALIDATION
function validateLogin() {
    let isValid = true;
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    clearFieldError('loginEmail', 'loginEmailError');
    clearFieldError('loginPassword', 'loginPasswordError');
    
    if (!email) {
        setFieldError('loginEmail', 'loginEmailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        setFieldError('loginEmail', 'loginEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password) {
        setFieldError('loginPassword', 'loginPasswordError', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        setFieldError('loginPassword', 'loginPasswordError', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    return isValid;
}

// SIGNUP VALIDATION
function validateSignup() {
    let isValid = true;
    const fullname = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;
    
    clearFieldError('signupName', 'signupNameError');
    clearFieldError('signupEmail', 'signupEmailError');
    clearFieldError('signupPassword', 'signupPasswordError');
    clearFieldError('signupConfirm', 'signupConfirmError');
    
    if (!fullname) {
        setFieldError('signupName', 'signupNameError', 'Full name is required');
        isValid = false;
    } else if (fullname.length < 2) {
        setFieldError('signupName', 'signupNameError', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    if (!email) {
        setFieldError('signupEmail', 'signupEmailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        setFieldError('signupEmail', 'signupEmailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!password) {
        setFieldError('signupPassword', 'signupPasswordError', 'Password is required');
        isValid = false;
    } else if (password.length < 6) {
        setFieldError('signupPassword', 'signupPasswordError', 'Password must be at least 6 characters');
        isValid = false;
    } else if (!/[A-Z]/.test(password)) {
        setFieldError('signupPassword', 'signupPasswordError', 'Password must contain at least one uppercase letter');
        isValid = false;
    } else if (!/[0-9]/.test(password)) {
        setFieldError('signupPassword', 'signupPasswordError', 'Password must contain at least one number');
        isValid = false;
    }
    
    if (!confirm) {
        setFieldError('signupConfirm', 'signupConfirmError', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirm) {
        setFieldError('signupConfirm', 'signupConfirmError', 'Passwords do not match');
        isValid = false;
    }
    
    return isValid;
}

// Handle Login Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateLogin()) {
        const email = document.getElementById('loginEmail').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;
        
        console.log('Login attempt:', { email, rememberMe });
        
        showToast(`Welcome back! ${email.split('@')[0]} ✨`, 'success');
        
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        
        loginForm.reset();
        clearFormErrors(loginForm);
    } else {
        showToast('Please fix the errors above', 'error');
    }
});

// Handle Signup Submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateSignup()) {
        const fullname = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        
        console.log('Signup attempt:', { fullname, email });
        
        showToast(`Account created successfully! Welcome ${fullname.split(' ')[0]} 🎉`, 'success');
        
        setTimeout(() => {
            signupPanel.classList.add('hidden');
            loginPanel.classList.remove('hidden');
            signupForm.reset();
            clearFormErrors(signupForm);
            const strengthDiv = document.getElementById('passwordStrength');
            if (strengthDiv) strengthDiv.textContent = '';
        }, 1500);
    } else {
        showToast('Please check the form and try again', 'error');
    }
});

// Switch to Signup Panel
showSignupBtn.addEventListener('click', () => {
    loginPanel.classList.add('hidden');
    signupPanel.classList.remove('hidden');
    clearFormErrors(loginForm);
    clearFormErrors(signupForm);
    const strengthDiv = document.getElementById('passwordStrength');
    if (strengthDiv) strengthDiv.textContent = '';
});

// Switch to Login Panel
showLoginBtn.addEventListener('click', () => {
    signupPanel.classList.add('hidden');
    loginPanel.classList.remove('hidden');
    clearFormErrors(loginForm);
    clearFormErrors(signupForm);
});

// Real-time validation for login inputs
function addLiveClear(inputId, errorId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', () => {
            clearFieldError(inputId, errorId);
        });
    }
}

addLiveClear('loginEmail', 'loginEmailError');
addLiveClear('loginPassword', 'loginPasswordError');
addLiveClear('signupName', 'signupNameError');
addLiveClear('signupEmail', 'signupEmailError');
addLiveClear('signupPassword', 'signupPasswordError');
addLiveClear('signupConfirm', 'signupConfirmError');

// Load remembered email from localStorage
const remembered = localStorage.getItem('rememberedEmail');
if (remembered && document.getElementById('loginEmail')) {
    document.getElementById('loginEmail').value = remembered;
    const rememberCheckbox = document.getElementById('rememberMe');
    if (rememberCheckbox) rememberCheckbox.checked = true;
}

// Forgot password demo alert
const forgotLink = document.querySelector('.forgot-link');
if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Password reset link sent to your email (demo)', 'success');
    });
}

// Initialize password toggle functionality
setupPasswordToggle();