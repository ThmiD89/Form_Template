// DOM Elements
const steps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.step');
const form = document.getElementById('registrationForm');
const modal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Courses Data
const courses = [
    { id: 1, name: 'Computer Science 101', code: 'CS101', credits: 3 },
    { id: 2, name: 'Data Structures', code: 'CS201', credits: 4 },
    { id: 3, name: 'Algorithms', code: 'CS301', credits: 4 },
    { id: 4, name: 'Web Development', code: 'CS401', credits: 3 },
    { id: 5, name: 'Database Systems', code: 'CS202', credits: 3 },
    { id: 6, name: 'Operating Systems', code: 'CS303', credits: 4 },
    { id: 7, name: 'Software Engineering', code: 'CS402', credits: 3 },
    { id: 8, name: 'Artificial Intelligence', code: 'CS501', credits: 4 },
    { id: 9, name: 'Calculus I', code: 'MATH101', credits: 3 },
    { id: 10, name: 'Physics I', code: 'PHY101', credits: 3 }
];

let selectedCourses = [];

// Load courses into grid
function loadCourses() {
    const grid = document.getElementById('coursesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'course-checkbox';
        div.innerHTML = `
            <input type="checkbox" id="course_${course.id}" value="${course.id}" data-credits="${course.credits}" data-name="${course.name} (${course.code})">
            <label for="course_${course.id}">${course.name}</label>
            <span class="course-credits">${course.credits} credits</span>
        `;
        grid.appendChild(div);
    });
    
    // Add event listeners to checkboxes
    document.querySelectorAll('#coursesGrid input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', updateCourseSelection);
    });
}

// Update selected courses
function updateCourseSelection() {
    const checkboxes = document.querySelectorAll('#coursesGrid input[type="checkbox"]:checked');
    selectedCourses = Array.from(checkboxes).map(cb => ({
        id: parseInt(cb.value),
        name: cb.getAttribute('data-name'),
        credits: parseInt(cb.getAttribute('data-credits'))
    }));
    
    const infoDiv = document.getElementById('selectedCoursesInfo');
    const errorDiv = document.getElementById('coursesError');
    
    if (selectedCourses.length > 0) {
        const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
        infoDiv.innerHTML = `✅ Selected ${selectedCourses.length} course(s) | Total Credits: ${totalCredits}`;
    } else {
        infoDiv.innerHTML = '';
    }
    
    // Clear error when valid
    if (selectedCourses.length >= 3 && selectedCourses.length <= 6) {
        errorDiv.textContent = '';
    }
}

// Validate Course Selection
function validateCourses() {
    const errorDiv = document.getElementById('coursesError');
    
    if (selectedCourses.length < 3) {
        errorDiv.textContent = '❌ Please select at least 3 courses (Minimum: 3 courses)';
        return false;
    }
    
    if (selectedCourses.length > 6) {
        errorDiv.textContent = '❌ You cannot select more than 6 courses (Maximum: 6 courses)';
        return false;
    }
    
    errorDiv.textContent = '';
    return true;
}

// Switch Steps
function showStep(stepNumber) {
    steps.forEach((step, index) => {
        if (index + 1 === stepNumber) {
            step.style.display = 'block';
        } else {
            step.style.display = 'none';
        }
    });
    
    // Update progress steps
    progressSteps.forEach((step, index) => {
        if (index + 1 <= stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Validation Functions for Step 1
function validateStep1() {
    let isValid = true;
    
    // Full Name
    const fullName = document.getElementById('fullName').value.trim();
    const fullNameError = document.getElementById('fullNameError');
    if (!fullName) {
        fullNameError.textContent = 'Full name is required';
        document.getElementById('fullName').classList.add('error-input');
        isValid = false;
    } else if (fullName.length < 3) {
        fullNameError.textContent = 'Name must be at least 3 characters';
        document.getElementById('fullName').classList.add('error-input');
        isValid = false;
    } else {
        fullNameError.textContent = '';
        document.getElementById('fullName').classList.remove('error-input');
    }
    
    // Date of Birth
    const dob = document.getElementById('dateOfBirth').value;
    const dobError = document.getElementById('dateOfBirthError');
    if (!dob) {
        dobError.textContent = 'Date of birth is required';
        document.getElementById('dateOfBirth').classList.add('error-input');
        isValid = false;
    } else {
        const age = new Date().getFullYear() - new Date(dob).getFullYear();
        if (age < 16 || age > 100) {
            dobError.textContent = 'Age must be between 16 and 100';
            document.getElementById('dateOfBirth').classList.add('error-input');
            isValid = false;
        } else {
            dobError.textContent = '';
            document.getElementById('dateOfBirth').classList.remove('error-input');
        }
    }
    
    // Email
    const email = document.getElementById('email').value.trim();
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        emailError.textContent = 'Email is required';
        document.getElementById('email').classList.add('error-input');
        isValid = false;
    } else if (!emailRegex.test(email)) {
        emailError.textContent = 'Enter a valid email address';
        document.getElementById('email').classList.add('error-input');
        isValid = false;
    } else {
        emailError.textContent = '';
        document.getElementById('email').classList.remove('error-input');
    }
    
    // Phone
    const phone = document.getElementById('phone').value.trim();
    const phoneError = document.getElementById('phoneError');
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
    if (!phone) {
        phoneError.textContent = 'Phone number is required';
        document.getElementById('phone').classList.add('error-input');
        isValid = false;
    } else if (!phoneRegex.test(phone) || phone.length < 10) {
        phoneError.textContent = 'Enter a valid phone number (min 10 digits)';
        document.getElementById('phone').classList.add('error-input');
        isValid = false;
    } else {
        phoneError.textContent = '';
        document.getElementById('phone').classList.remove('error-input');
    }
    
    // Address
    const address = document.getElementById('address').value.trim();
    const addressError = document.getElementById('addressError');
    if (!address) {
        addressError.textContent = 'Address is required';
        document.getElementById('address').classList.add('error-input');
        isValid = false;
    } else {
        addressError.textContent = '';
        document.getElementById('address').classList.remove('error-input');
    }
    
    // Gender
    const gender = document.getElementById('gender').value;
    const genderError = document.getElementById('genderError');
    if (!gender) {
        genderError.textContent = 'Please select gender';
        document.getElementById('gender').classList.add('error-input');
        isValid = false;
    } else {
        genderError.textContent = '';
        document.getElementById('gender').classList.remove('error-input');
    }
    
    // Nationality
    const nationality = document.getElementById('nationality').value.trim();
    const nationalityError = document.getElementById('nationalityError');
    if (!nationality) {
        nationalityError.textContent = 'Nationality is required';
        document.getElementById('nationality').classList.add('error-input');
        isValid = false;
    } else {
        nationalityError.textContent = '';
        document.getElementById('nationality').classList.remove('error-input');
    }
    
    return isValid;
}

// Validation for Step 2
function validateStep2() {
    let isValid = true;
    
    const studentId = document.getElementById('studentId').value.trim();
    const studentIdError = document.getElementById('studentIdError');
    if (!studentId) {
        studentIdError.textContent = 'Student ID is required';
        document.getElementById('studentId').classList.add('error-input');
        isValid = false;
    } else {
        studentIdError.textContent = '';
        document.getElementById('studentId').classList.remove('error-input');
    }
    
    const department = document.getElementById('department').value;
    const deptError = document.getElementById('departmentError');
    if (!department) {
        deptError.textContent = 'Please select department';
        document.getElementById('department').classList.add('error-input');
        isValid = false;
    } else {
        deptError.textContent = '';
        document.getElementById('department').classList.remove('error-input');
    }
    
    const semester = document.getElementById('semester').value;
    const semesterError = document.getElementById('semesterError');
    if (!semester) {
        semesterError.textContent = 'Please select semester';
        document.getElementById('semester').classList.add('error-input');
        isValid = false;
    } else {
        semesterError.textContent = '';
        document.getElementById('semester').classList.remove('error-input');
    }
    
    const academicYear = document.getElementById('academicYear').value;
    const yearError = document.getElementById('academicYearError');
    if (!academicYear) {
        yearError.textContent = 'Please select academic year';
        document.getElementById('academicYear').classList.add('error-input');
        isValid = false;
    } else {
        yearError.textContent = '';
        document.getElementById('academicYear').classList.remove('error-input');
    }
    
    const gpa = document.getElementById('gpa').value;
    const gpaError = document.getElementById('gpaError');
    if (!gpa) {
        gpaError.textContent = 'GPA is required';
        document.getElementById('gpa').classList.add('error-input');
        isValid = false;
    } else if (gpa < 0 || gpa > 4) {
        gpaError.textContent = 'GPA must be between 0 and 4';
        document.getElementById('gpa').classList.add('error-input');
        isValid = false;
    } else {
        gpaError.textContent = '';
        document.getElementById('gpa').classList.remove('error-input');
    }
    
    return isValid;
}

// Collect all form data
function collectFormData() {
    return {
        personalInfo: {
            fullName: document.getElementById('fullName').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            gender: document.getElementById('gender').options[document.getElementById('gender').selectedIndex]?.text,
            nationality: document.getElementById('nationality').value
        },
        academicInfo: {
            studentId: document.getElementById('studentId').value,
            department: document.getElementById('department').options[document.getElementById('department').selectedIndex]?.text,
            semester: document.getElementById('semester').options[document.getElementById('semester').selectedIndex]?.text,
            academicYear: document.getElementById('academicYear').value,
            gpa: document.getElementById('gpa').value,
            creditsCompleted: document.getElementById('creditsCompleted').value || '0'
        },
        courses: selectedCourses
    };
}

// Show success modal with summary
function showSuccessModal() {
    const data = collectFormData();
    const totalCredits = selectedCourses.reduce((sum, c) => sum + c.credits, 0);
    
    const summaryHTML = `
        <strong>🎓 Student Information:</strong><br>
        Name: ${data.personalInfo.fullName}<br>
        Student ID: ${data.academicInfo.studentId}<br>
        Email: ${data.personalInfo.email}<br>
        Department: ${data.academicInfo.department}<br>
        Semester: ${data.academicInfo.semester}<br>
        GPA: ${data.academicInfo.gpa}<br><br>
        <strong>📖 Selected Courses (${selectedCourses.length}):</strong><br>
        ${selectedCourses.map(c => `• ${c.name} (${c.credits} credits)`).join('<br>')}<br><br>
        <strong>Total Credits: ${totalCredits}</strong>
    `;
    
    document.getElementById('summaryData').innerHTML = summaryHTML;
    modal.classList.add('show');
}

// Event Listeners for Next/Prev buttons
document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
        const currentStep = parseInt(btn.closest('.form-step').id.replace('step', ''));
        const nextStep = parseInt(btn.getAttribute('data-next'));
        
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 2 && !validateStep2()) return;
        
        showStep(nextStep);
    });
});

document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
        const prevStep = parseInt(btn.getAttribute('data-prev'));
        showStep(prevStep);
    });
});

// Form Submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateCourses()) return;
    
    // Validate all steps before final submission
    if (!validateStep1() || !validateStep2()) {
        showStep(1);
        alert('Please complete all required fields in Personal Information and Academic Details.');
        return;
    }
    
    // Show success modal
    showSuccessModal();
    
    // Log to console for demo
    console.log('Registration Submitted:', collectFormData());
});

// Modal close
closeModalBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    form.reset();
    selectedCourses = [];
    showStep(1);
    document.getElementById('selectedCoursesInfo').innerHTML = '';
    document.getElementById('coursesError').innerHTML = '';
    
    // Uncheck all course checkboxes
    document.querySelectorAll('#coursesGrid input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

// Initialize
loadCourses();
showStep(1);