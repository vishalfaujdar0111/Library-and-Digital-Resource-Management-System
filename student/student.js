// =====================================================
//  MEMBER 2 - student.js
//  Pages: student.html (Dashboard), search.html, profile.html
// =====================================================


// ─── 1. AAJ KI DATE DIKHANA (student.html) ───
const dateBox = document.getElementById('current-date');

if (dateBox) {
  const today = new Date();
  dateBox.textContent = today.toDateString();
}


// ─── 2. BOOK SEARCH (search.html) ───
// Naam ya author likhte hi table filter ho jayegi
function searchBooks() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#booksBody tr:not(#noResultRow)');
  let visibleCount = 0;

  rows.forEach(function (row) {
    const text = row.textContent.toLowerCase();

    if (text.includes(input)) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });

  showNoResult(visibleCount);
}


// ─── 3. "NO BOOK FOUND" MESSAGE (search.html) ───
function showNoResult(count) {
  const tbody = document.getElementById('booksBody');
  let noRow = document.getElementById('noResultRow');

  // Koi book nahi mili -> message dikhao
  if (count === 0 && !noRow) {
    noRow = document.createElement('tr');
    noRow.id = 'noResultRow';
    noRow.innerHTML =
      '<td colspan="6" style="text-align:center; color:#E74C3C; padding:20px;">' +
      'No book found!</td>';
    tbody.appendChild(noRow);
  }

  // Book mil gayi -> message hatao
  if (count > 0 && noRow) {
    noRow.remove();
  }
}


// ─── 4. DOWNLOAD BUTTON MESSAGE (student.html) ───
// Abhi real PDF nahi hai, isliye click par message aayega
const downloadButtons = document.querySelectorAll('.btn-download');

downloadButtons.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    e.preventDefault();

    // Button ke upar wale card se resource ka naam nikalo
    const card = btn.closest('.resource-card');
    const name = card.querySelector('h4').textContent;

    alert('"' + name + '" download will start after backend is connected!');
  });
});


// ─── 5. CURRENT PAGE KA NAVBAR LINK HIGHLIGHT ───
// Jis page par ho, uska link thoda alag dikhega
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('.nav-links a');

navLinks.forEach(function (link) {
  const linkPage = link.getAttribute('href');

  if (linkPage === currentPage) {
    link.style.color = '#F39C12';
    link.style.fontWeight = '600';
  }
});