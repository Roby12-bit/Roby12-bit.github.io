function toggleDropdown() {
    document.getElementById("meniulMeu").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
// A helper function to update the user interface based on login status
function updateUI(session) {
  const loginBtn = document.getElementById('nav-login');
  const logoutBtn = document.getElementById('nav-logout');
  const emailInput = document.getElementById('contact-email');

  if (session) {
    // User is Logged In
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
    
    // Auto-fill the contact email form
    if (emailInput) {
      emailInput.value = session.user.email;
      // Optional: make it read-only so they can't change it
      // emailInput.readOnly = true; 
    }
  } else {
    // User is NOT Logged In
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    
    // Clear the email input
    if (emailInput) {
      emailInput.value = '';
      // emailInput.readOnly = false;
    }
  }
}

// 1. Check the session when the page first loads
async function checkCurrentSession() {
  const { data: { session }, error } = await window.supabaseClient.auth.getSession();
  updateUI(session);
}

// 2. Listen for any login/logout events dynamically
window.supabaseClient.auth.onAuthStateChange((event, session) => {
  updateUI(session);
});

// 3. Handle the Logout Button Click
document.getElementById('nav-logout').addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent page reload
  const { error } = await window.supabaseClient.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message);
  } else {
    alert("Te-ai deconectat cu succes!"); // "You have successfully logged out"
  }
});

// Run the initial check
checkCurrentSession();
