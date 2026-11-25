// =====================================================
//  MEMBER 3 - librarian.js
//  Pages: librarian.html (Dashboard), issue.html, return.html
// =====================================================

// Fine ka rate: har late din ke liye 5 rupaye
const FINE_PER_DAY = 5;

// Dummy students (backend judne ke baad ye database se aayenge)
const students = {
  '2201010001': 'Rahul Sharma',
  '2201010002': 'Priya Singh',
  '2201010003': 'Amit Kumar',
  '2201010004': 'Neha Gupta',
  '2201010005': 'Ravi Verma'
};


// ─── 1. AAJ KI DATE DIKHANA (librarian.html) ───
const dateBox = document.getElementById('current-date');

if (dateBox) {
  dateBox.textContent = new Date().toDateString();
}


// ─── 2. QUICK ACTION BUTTONS (librarian.html) ───
// "Add New Book" aur "View Members" abhi ready nahi hain
const comingSoonLinks = document.querySelectorAll('.action-btn[href="#"]');

comingSoonLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    alert('This feature will be available after backend is connected!');
  });
});


// ─── 3. HELPER FUNCTIONS ───

// Date ko "YYYY-MM-DD" format mein badalta hai (input type="date" ke liye)
function toInputDate(dateObj) {
  return dateObj.toISOString().split('T')[0];
}

// "2025-09-20" ko "20 Sep 2025" jaisa sundar format deta hai
function formatDate(dateString) {
  const d = new Date(dateString + 'T00:00:00');
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

// Success ya error message dikhata hai, phir 3 second baad hata deta hai
function showMessage(type, text) {
  const successMsg = document.getElementById('success-msg');
  const errorMsg = document.getElementById('error-msg');

  successMsg.textContent = '';
  errorMsg.textContent = '';

  if (type === 'success') {
    successMsg.textContent = text;
  } else {
    errorMsg.textContent = text;
  }

  setTimeout(function () {
    successMsg.textContent = '';
    errorMsg.textContent = '';
  }, 3000);
}


// ─── 4. ISSUE PAGE SETUP (issue.html) ───
const issueDateInput = document.getElementById('issueDate');
const returnDateInput = document.getElementById('returnDate');
const studentNameInput = document.getElementById('studentName');

// Ye sab sirf issue.html par chalega (studentName wahi hai)
if (issueDateInput && returnDateInput && studentNameInput) {

  // Issue date = aaj, Return date = aaj se 14 din baad
  const today = new Date();
  const after14Days = new Date();
  after14Days.setDate(today.getDate() + 14);

  issueDateInput.value = toInputDate(today);
  returnDateInput.value = toInputDate(after14Days);

  // Issue date badalne par return date khud 14 din aage ho jayegi
  issueDateInput.addEventListener('change', function () {
    const newIssue = new Date(issueDateInput.value);
    newIssue.setDate(newIssue.getDate() + 14);
    returnDateInput.value = toInputDate(newIssue);
  });

  // Roll number likhte hi student ka naam khud aa jayega
  document.getElementById('rollNo').addEventListener('input', function () {
    const roll = this.value.trim();

    if (students[roll]) {
      studentNameInput.value = students[roll];
    } else {
      studentNameInput.value = '';
    }
  });
}


// ─── 5. BOOK ISSUE KARNA (issue.html) ───
function issueBook() {
  const roll = document.getElementById('rollNo').value.trim();
  const studentName = document.getElementById('studentName').value;
  const book = document.getElementById('bookName').value;
  const issueDate = document.getElementById('issueDate').value;
  const returnDate = document.getElementById('returnDate').value;

  // Validation checks
  if (roll === '' || book === '') {
    showMessage('error', 'Please fill all fields!');
    return;
  }

  if (!students[roll]) {
    showMessage('error', 'Student not found! Try 2201010001');
    return;
  }

  if (returnDate <= issueDate) {
    showMessage('error', 'Return date must be after issue date!');
    return;
  }

  // Table mein nayi row jodo
  const tbody = document.getElementById('issuedBody');

  tbody.insertAdjacentHTML('beforeend',
    '<tr>' +
    '<td>' + roll + '</td>' +
    '<td>' + studentName + '</td>' +
    '<td>' + book + '</td>' +
    '<td>' + formatDate(issueDate) + '</td>' +
    '<td>' + formatDate(returnDate) + '</td>' +
    '</tr>'
  );

  showMessage('success', 'Book issued successfully!');

  // Form khali karo
  document.getElementById('rollNo').value = '';
  document.getElementById('studentName').value = '';
  document.getElementById('bookName').value = '';
}


// ─── 6. RETURN PAGE SETUP (return.html) ───
const actualReturnInput = document.getElementById('actualReturn');

// Actual return date by default aaj ki
if (actualReturnInput) {
  actualReturnInput.value = toInputDate(new Date());
}


// ─── 7. FINE NIKALNA ───
// Due date aur actual date ka difference nikalke fine batata hai
function getFine(dueDate, actualDate) {
  const due = new Date(dueDate);
  const actual = new Date(actualDate);

  // 1 din = 1000ms * 60s * 60min * 24hr
  const lateDays = Math.floor((actual - due) / (1000 * 60 * 60 * 24));

  if (lateDays > 0) {
    return lateDays * FINE_PER_DAY;
  }
  return 0;
}


// ─── 8. FINE CALCULATE BUTTON (return.html) ───
function calculateFine() {
  const dueDate = document.getElementById('dueDate').value;
  const actualDate = document.getElementById('actualReturn').value;
  const fineBox = document.getElementById('fineBox');
  const fineAmount = document.getElementById('fineAmount');

  if (dueDate === '' || actualDate === '') {
    showMessage('error', 'Please enter due date and return date!');
    return;
  }

  const fine = getFine(dueDate, actualDate);
  fineBox.style.display = 'flex';

  if (fine > 0) {
    fineAmount.textContent = '₹' + fine;
    fineAmount.style.color = '#E74C3C';
  } else {
    fineAmount.textContent = '₹0 - No Fine!';
    fineAmount.style.color = '#27AE60';
  }
}


// ─── 9. BOOK RETURN KARNA (return.html) ───
function returnBook() {
  const roll = document.getElementById('rollNo').value.trim();
  const book = document.getElementById('bookName').value;
  const dueDate = document.getElementById('dueDate').value;
  const actualDate = document.getElementById('actualReturn').value;

  if (roll === '' || book === '' || dueDate === '') {
    showMessage('error', 'Please fill all fields!');
    return;
  }

  // Fine yahin dobara nikalte hain, taaki button dabaye bina bhi sahi rahe
  const fine = getFine(dueDate, actualDate);

  const tbody = document.getElementById('returnedBody');

  tbody.insertAdjacentHTML('beforeend',
    '<tr>' +
    '<td>' + roll + '</td>' +
    '<td>' + book + '</td>' +
    '<td>' + formatDate(dueDate) + '</td>' +
    '<td>' + formatDate(actualDate) + '</td>' +
    '<td>₹' + fine + '</td>' +
    '<td><span class="badge green">Returned</span></td>' +
    '</tr>'
  );

  showMessage('success', 'Book returned successfully!');

  // Form reset
  document.getElementById('rollNo').value = '';
  document.getElementById('bookName').value = '';
  document.getElementById('dueDate').value = '';
  document.getElementById('fineBox').style.display = 'none';
}


// ─── 10. CURRENT PAGE KA NAVBAR LINK HIGHLIGHT ───
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(function (link) {
  if (link.getAttribute('href') === currentPage) {
    link.style.color = '#F39C12';
    link.style.fontWeight = '600';
  }
});