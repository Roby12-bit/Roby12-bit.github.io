const supabase = window.supabaseClient;

function updateUI(session) {
  const loginBtn = document.getElementById('nav-login');
  const logoutBtn = document.getElementById('nav-logout');
  const emailInput = document.getElementById('contact-email');

  if (session) {
  
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
  
    if (emailInput) {
      emailInput.value = session.user.email;
      emailInput.readOnly = true; 
      emailInput.style.opacity = "0.7";
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    if (emailInput) {
      emailInput.value = '';
      emailInput.readOnly = false;
      emailInput.style.opacity = "1";
    }
  }
}

async function checkCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  updateUI(session);
}

supabase.auth.onAuthStateChange((event, session) => {
  updateUI(session);
});

const logoutElement = document.getElementById('nav-logout');
if (logoutElement) {
  logoutElement.addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      alert("Te-ai deconectat!");
      window.location.reload(); 
    }
  });
}

checkCurrentSession();
