const supabase = window.supabaseClient;

function updateUI(session) {
  const loginBtn = document.getElementById('nav-login');
  const logoutBtn = document.getElementById('nav-logout');
  const emailInput = document.getElementById('contact-email');

  if (session) {
    // USER LOGGED IN: Hide login interface, show logout switch
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    
    // Autofill the contact field securely
    if (emailInput) {
      emailInput.value = session.user.email;
      emailInput.readOnly = true; // Lock it down so they don't spoof emails
      emailInput.style.opacity = "0.7";
    }
  } else {
    // USER LOGGED OUT: Show login interface option, hide logout
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    if (emailInput) {
      emailInput.value = '';
      emailInput.readOnly = false;
      emailInput.style.opacity = "1";
    }
  }
}

// Check real-time auth states on page wake/render
async function checkCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  updateUI(session);
}

// Watch state adjustments automatically (login, logout, token refreshes)
supabase.auth.onAuthStateChange((event, session) => {
  updateUI(session);
});

// Handle user logging out securely
const logoutElement = document.getElementById('nav-logout');
if (logoutElement) {
  logoutElement.addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      alert("Te-ai deconectat!");
      window.location.reload(); // Refresh context
    }
  });
}

checkCurrentSession();
