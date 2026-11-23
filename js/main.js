// =====================================================
//  MEMBER 1 - main.js
//  Pages: index.html (Home) + login.html (Login)
// =====================================================


// ─── 1. NAVBAR SCROLL EFFECT ───
// Scroll karne par navbar ka shadow gehra ho jayega
const navbar = document.querySelector('.navbar');

if (navbar) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    }
  });
}


// ─── 2. SMOOTH SCROLLING ───
// Features / About links par click karne par page smooth scroll hoga
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');

    // "#" akela hai (jaise Forgot Password) to kuch mat karo
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


// ─── 3. CARDS FADE-IN ANIMATION ───
// Feature aur Role cards screen par aate hi dheere se dikhenge
const cards = document.querySelectorAll('.feature-card, .role-card');

if (cards.length > 0) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(function (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
}


// ─── 4. ROLE SELECTION (login.html) ───
// Student / Librarian / Admin button select karna
let selectedRole = 'student';

function selectRole(role, btn) {
  selectedRole = role;

  // Pehle sabse "active" hatao
  document.querySelectorAll('.role-btn').forEach(function (b) {
    b.classList.remove('active');
  });

  // Jo click hua usko "active" do
  btn.classList.add('active');
}


// ─── 5. SHOW / HIDE PASSWORD (login.html) ───
function togglePassword() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('toggle-eye');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
  }
}


// ─── 6. EMAIL CHECK ───
// Simple check: email mein @ aur . hona chahiye
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// ─── 7. ERROR MESSAGE DIKHANA ───
function showError(message) {
  const errorMsg = document.getElementById('error-msg');
  errorMsg.textContent = message;

  // 3 second baad error gayab
  setTimeout(function () {
    errorMsg.textContent = '';
  }, 3000);
}


// ─── 8. LOGIN VALIDATION + REDIRECT (login.html) ───
function handleLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Validation checks
  if (email === '' && password === '') {
    showError('Please enter email and password!');
    return;
  }

  if (email === '') {
    showError('Please enter your email!');
    return;
  }

  if (!isValidEmail(email)) {
    showError('Please enter a valid email!');
    return;
  }

  if (password === '') {
    showError('Please enter your password!');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters!');
    return;
  }

  // Sab sahi hai -> role ke hisaab se dashboard kholo
  // (Abhi dummy login hai, backend baad mein judega)
  // NOTE: login.html root mein hai, isliye "../" nahi lagaya
  if (selectedRole === 'student') {
    window.location.href = 'student/student.html';
  } else if (selectedRole === 'librarian') {
    window.location.href = 'librarian/librarian.html';
  } else if (selectedRole === 'admin') {
    window.location.href = 'admin/admin.html';
  }
}


// ─── 9. ENTER KEY SE LOGIN (login.html) ───
document.addEventListener('keydown', function (e) {
  const loginButton = document.querySelector('.btn-submit');

  if (e.key === 'Enter' && loginButton) {
    handleLogin();
  }
});