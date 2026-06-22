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
  // DIAGNOSTIC 1: Vedem exact ce zice Supabase despre utilizator
  console.log("1. Supabase Session status:", session); 

  const loginBtn = document.getElementById('nav-login');
  const logoutBtn = document.getElementById('nav-logout');
  const emailInput = document.getElementById('contact-email');
  const greetingHeading = document.getElementById('hero-greeting');

  // DIAGNOSTIC 2: Vedem dacă scriptul a găsit cu succes elementul din HTML
  console.log("2. Elementul #hero-greeting a fost găsit?:", greetingHeading);

  if (session) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
    if (emailInput) {
      emailInput.value = session.user.email;
    }

    if (greetingHeading) {
      const username = session.user.user_metadata?.username || 'prietene';
      greetingHeading.innerHTML = `Salut <span>${username}</span>, sunt <span>Roberto</span>`;
      console.log("3. Succes! Salutul a fost schimbat pentru:", username);
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (emailInput) {
      emailInput.value = '';
    }

    if (greetingHeading) {
      greetingHeading.innerHTML = `Salut, sunt <span>Roberto</span>`;
      console.log("3. Utilizatorul nu e conectat. Se afișează salutul implicit.");
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
