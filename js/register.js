// =====================================================
//  MEMBER 1 - register.js
//  Page: register.html (New user registration)
// =====================================================

// Registered users browser ki localStorage mein is naam se save honge
const STORAGE_KEY = 'ldrmsUsers';

let selectedRole = 'student';


// ─── 1. ROLE SELECT (Student / Librarian) ───
// Role badalne par label aur branch field bhi badal jate hain
function selectRegRole(role, btn) {
  selectedRole = role;

  document.querySelectorAll('.role-btn').forEach(function (b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');

  const idLabel = document.getElementById('idLabel');
  const idInput = document.getElementById('idNumber');
  const branchGroup = document.getElementById('branchGroup');

  if (role === 'student') {
    idLabel.textContent = 'Roll Number';
    idInput.placeholder = 'Enter your roll number';
    branchGroup.style.display = 'block';
  } else {
    idLabel.textContent = 'Employee ID';
    idInput.placeholder = 'Enter your employee ID';
    branchGroup.style.display = 'none';   // librarian ko branch nahi chahiye
  }
}


// ─── 2. SHOW / HIDE PASSWORD ───
// Dono password boxes ke liye ek hi function (id bhejte hain)
function toggleRegPassword(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon = document.getElementById(iconId);

  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    input.type = 'password';
    icon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}


// ─── 3. PASSWORD STRENGTH BAR ───
// Password likhte waqt weak / medium / strong dikhata hai
document.getElementById('password').addEventListener('input', function () {
  const pwd = this.value;
  const bar = document.getElementById('strengthBar');
  const text = document.getElementById('strengthText');

  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;

  if (pwd.length === 0) {
    bar.style.width = '0';
    text.textContent = '';
  } else if (score <= 2) {
    bar.style.width = '33%';
    bar.style.background = '#E74C3C';
    text.textContent = 'Weak';
    text.style.color = '#E74C3C';
  } else if (score <= 3) {
    bar.style.width = '66%';
    bar.style.background = '#F39C12';
    text.textContent = 'Medium';
    text.style.color = '#F39C12';
  } else {
    bar.style.width = '100%';
    bar.style.background = '#27AE60';
    text.textContent = 'Strong';
    text.style.color = '#27AE60';
  }
});


// ─── 4. CHHOTE HELPER FUNCTIONS ───
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(message) {
  const errorMsg = document.getElementById('error-msg');
  document.getElementById('success-msg').textContent = '';
  errorMsg.textContent = message;

  setTimeout(function () {
    errorMsg.textContent = '';
  }, 4000);
}

// Pehle se registered users nikalta hai (nahi mile to khali list)
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}


// ─── 5. REGISTER VALIDATION + SAVE ───
function handleRegister() {
  const fullName = document.getElementById('fullName').value.trim();
  const idNumber = document.getElementById('idNumber').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const phone = document.getElementById('phone').value.trim();
  const branch = document.getElementById('branch').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const termsChecked = document.getElementById('terms').checked;

  // --- Validation (pehla galat milte hi function ruk jayega) ---
  if (fullName.length < 3) {
    showError('Please enter your full name (at least 3 letters)!');
    return;
  }

  if (!/^[A-Za-z ]+$/.test(fullName)) {
    showError('Name can contain only letters and spaces!');
    return;
  }

  if (selectedRole === 'student') {
    if (!/^[0-9]{8,12}$/.test(idNumber)) {
      showError('Roll number must be 8 to 12 digits!');
      return;
    }
  } else if (idNumber.length < 3) {
    showError('Please enter a valid employee ID!');
    return;
  }

  if (!isValidEmail(email)) {
    showError('Please enter a valid email!');
    return;
  }

  // Indian mobile number: 10 digit, 6-9 se shuru
  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    showError('Please enter a valid 10 digit mobile number!');
    return;
  }

  if (selectedRole === 'student' && branch === '') {
    showError('Please select your branch!');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters!');
    return;
  }

  if (password !== confirmPassword) {
    showError('Passwords do not match!');
    return;
  }

  if (!termsChecked) {
    showError('Please accept the terms to continue!');
    return;
  }

  // --- Duplicate check: email ya ID pehle se registered to nahi ---
  const users = getUsers();
  const alreadyExists = users.some(function (user) {
    return user.email === email || user.idNumber === idNumber;
  });

  if (alreadyExists) {
    showError('This email or ID is already registered!');
    return;
  }

  // --- Save ---
  // NOTE: Password yahan save nahi kar rahe (unsafe hota hai).
  // Backend judne ke baad password bcrypt se encrypt hokar MongoDB mein jayega.
  users.push({
    role: selectedRole,
    fullName: fullName,
    idNumber: idNumber,
    email: email,
    phone: phone,
    branch: selectedRole === 'student' ? branch : '',
    registeredOn: new Date().toISOString()
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  // --- Success message, phir login page par bhejo ---
  document.getElementById('error-msg').textContent = '';
  document.getElementById('success-msg').textContent =
    'Registration successful! Redirecting to login...';

  setTimeout(function () {
    window.location.href = 'login.html';
  }, 1800);
}


// ─── 6. ENTER KEY SE REGISTER ───
document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    handleRegister();
  }
});