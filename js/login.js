// 1. TAB SWITCHING LOGIC (Runs as soon as the HTML loads)
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const btnShowLogin = document.getElementById('show-login');
  const btnShowSignup = document.getElementById('show-signup');

  if (!loginForm || !signupForm || !btnShowLogin || !btnShowSignup) {
    console.error("Form elements missing in HTML! Check your IDs.");
    return;
  }

  // Switch to Login Tab
  btnShowLogin.addEventListener('click', () => {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    btnShowLogin.classList.add('active');
    btnShowSignup.classList.remove('active');
  });

  // Switch to Sign Up Tab
  btnShowSignup.addEventListener('click', () => {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    btnShowSignup.classList.add('active');
    btnShowLogin.classList.remove('active');
  });
});


// 2. USE A UNIQUE NAME TO PREVENT CLASHES
const supabaseDb = window.supabaseClient;
if (!supabaseDb) {
  console.error("Supabase Client is missing! Check js/supabaseClient.js or keys.");
}


// 3. LOG IN SUBMISSION
document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('btn-do-login');
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      if (!supabaseDb) return alert("Baza de date nu este conectată corect.");
      if (!email || !password) return alert("Te rugăm să completezi ambele câmpuri.");

      const { data, error } = await supabaseDb.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        alert("Eroare la conectare: " + error.message);
      } else {
        alert("Te-ai conectat cu succes!");
        window.location.href = 'index.html';
      }
    });
  }
});


// 4. SIGN UP SUBMISSION
document.addEventListener('DOMContentLoaded', () => {
  const signupBtn = document.getElementById('btn-do-signup');
  if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
      const username = document.getElementById('signup-username').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      if (!supabaseDb) return alert("Baza de date nu este conectată corect.");
      if (!username || !email || !password) return alert("Te rugăm să completezi toate câmpurile.");

      // Create secure account AND save the username in one single step
      const { data, error } = await supabaseDb.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username // Packs the username safely into the Auth metadata
          }
        }
      });

      if (error) {
        return alert("Eroare la înregistrare: " + error.message);
      } else {
        alert("Înregistrare completă! Acum te poți conecta.");
        document.getElementById('show-login').click(); // Auto-switch to login tab
        
        // Optional: clear the signup inputs after success
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-password').value = '';
      }
    });
  }
});
