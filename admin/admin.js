// =====================================================
//  MEMBER 4 - admin.js
//  Pages: admin.html (Dashboard), members.html, reports.html
// =====================================================


// ─── 1. AAJ KI DATE DIKHANA (admin.html) ───
const dateBox = document.getElementById('current-date');

if (dateBox) {
  const today = new Date();
  dateBox.textContent = today.toDateString();
}


// ─── 2. STATS COUNTER ANIMATION (admin.html + reports.html) ───
// Cards ke numbers 0 se shuru hoke upar tak ginenge
// Example: 245, 320, ₹450, ₹1,250
function animateCounters() {
  const counters = document.querySelectorAll('.stat-card h3');

  counters.forEach(function (counter) {
    const originalText = counter.textContent;

    // "₹" hai to alag rakho, baaki se number nikalo
    const prefix = originalText.includes('₹') ? '₹' : '';
    const target = parseInt(originalText.replace(/[^0-9]/g, ''));

    if (isNaN(target)) return;

    let current = 0;
    const step = Math.ceil(target / 40);

    const timer = setInterval(function () {
      current += step;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      counter.textContent = prefix + current.toLocaleString('en-IN');
    }, 30);
  });
}

animateCounters();


// ─── 3. ADD MEMBER FORM KHOLNA / BAND KARNA (members.html) ───
function toggleForm() {
  const form = document.getElementById('addForm');

  if (form.style.display === 'none') {
    form.style.display = 'block';
  } else {
    form.style.display = 'none';
  }
}


// ─── 4. EMAIL CHECK ───
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// ─── 5. NAYA MEMBER ADD KARNA (members.html) ───
function addMember() {
  const name = document.getElementById('newName').value.trim();
  const roll = document.getElementById('newRoll').value.trim();
  const email = document.getElementById('newEmail').value.trim();
  const branch = document.getElementById('newBranch').value;
  const successMsg = document.getElementById('success-msg');

  // Khali fields check
  if (name === '' || roll === '' || email === '') {
    alert('Please fill all fields!');
    return;
  }

  // Email check
  if (!isValidEmail(email)) {
    alert('Please enter a valid email!');
    return;
  }

  // Roll number pehle se hai ya nahi
  const existingRows = document.querySelectorAll('#membersBody tr');
  let alreadyExists = false;

  existingRows.forEach(function (row) {
    const rollCell = row.children[2];
    if (rollCell && rollCell.textContent === roll) {
      alreadyExists = true;
    }
  });

  if (alreadyExists) {
    alert('This roll number is already added!');
    return;
  }

  // Table mein nayi row jodo
  const tbody = document.getElementById('membersBody');
  const serial = existingRows.length + 1;

  tbody.innerHTML +=
    '<tr>' +
    '<td>' + serial + '</td>' +
    '<td>' + name + '</td>' +
    '<td>' + roll + '</td>' +
    '<td>' + email + '</td>' +
    '<td>' + branch + '</td>' +
    '<td>0</td>' +
    '<td><span class="badge green">Active</span></td>' +
    '</tr>';

  // Success message
  successMsg.textContent = 'Member added successfully!';

  // Form khali karo
  document.getElementById('newName').value = '';
  document.getElementById('newRoll').value = '';
  document.getElementById('newEmail').value = '';

  setTimeout(function () {
    successMsg.textContent = '';
  }, 3000);
}


// ─── 6. MEMBER SEARCH (members.html) ───
function searchMembers() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#membersBody tr:not(#noResultRow)');
  let visibleCount = 0;

  rows.forEach(function (row) {
    if (row.textContent.toLowerCase().includes(input)) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  showNoResult(visibleCount);
}


// ─── 7. "NO MEMBER FOUND" MESSAGE (members.html) ───
function showNoResult(count) {
  const tbody = document.getElementById('membersBody');
  let noRow = document.getElementById('noResultRow');

  if (count === 0 && !noRow) {
    noRow = document.createElement('tr');
    noRow.id = 'noResultRow';
    noRow.innerHTML =
      '<td colspan="7" style="text-align:center; color:#E74C3C; padding:20px;">' +
      'No member found!</td>';
    tbody.appendChild(noRow);
  }

  if (count > 0 && noRow) {
    noRow.remove();
  }
}


// ─── 8. CURRENT PAGE KA NAVBAR LINK HIGHLIGHT ───
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(function (link) {
  if (link.getAttribute('href') === currentPage) {
    link.style.color = '#F39C12';
    link.style.fontWeight = '600';
  }
});