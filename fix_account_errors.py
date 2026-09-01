with open('public/account.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes_made = []

# 1. Update imports - remove redirect-based, add popup-based
old_import = '''import {
      onAuthStateChanged,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      updateProfile,
      GoogleAuthProvider,
      signInWithRedirect,
      getRedirectResult
    } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";'''

new_import = '''import {
      onAuthStateChanged,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      updateProfile,
      GoogleAuthProvider,
      signInWithPopup
    } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";'''

if old_import in content:
    content = content.replace(old_import, new_import, 1)
    changes_made.append("imports updated")
elif new_import in content:
    changes_made.append("imports already updated")
else:
    print("WARNING: import block not found")

# 2. Add friendlyAuthError function, remove getRedirectResult block
old_block = '''const errorEl = document.getElementById("account-error");

    getRedirectResult(auth).catch((err) => {
      errorEl.textContent = "Google sign-in failed: " + err.message;
    });

    onAuthStateChanged(auth, (user) => {'''

new_block = '''const errorEl = document.getElementById("account-error");

    function friendlyAuthError(err) {
      const code = err.code || "";
      const map = {
        "auth/user-not-found": "No account found with this email. Please sign up first.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Incorrect email or password, or no account exists. Please check and try again, or sign up.",
        "auth/email-already-in-use": "An account with this email already exists. Please login instead.",
        "auth/weak-password": "Password should be at least 6 characters.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/network-request-failed": "Network error. Please check your connection.",
        "auth/popup-closed-by-user": "Sign-in was cancelled."
      };
      return map[code] || "Something went wrong. Please try again.";
    }

    onAuthStateChanged(auth, (user) => {'''

if old_block in content:
    content = content.replace(old_block, new_block, 1)
    changes_made.append("friendlyAuthError added")
elif "function friendlyAuthError" in content:
    changes_made.append("friendlyAuthError already added")
else:
    print("WARNING: errorEl block not found")

# 3. Fix login error message
old_login_err = 'errorEl.textContent = "Login failed: " + err.message;'
new_login_err = 'errorEl.textContent = friendlyAuthError(err);'
if old_login_err in content:
    content = content.replace(old_login_err, new_login_err, 1)
    changes_made.append("login error fixed")

# 4. Fix signup error message
old_signup_err = 'errorEl.textContent = "Sign up failed: " + err.message;'
new_signup_err = 'errorEl.textContent = friendlyAuthError(err);'
if old_signup_err in content:
    content = content.replace(old_signup_err, new_signup_err, 1)
    changes_made.append("signup error fixed")

# 5. Fix Google sign-in to use popup instead of redirect
old_google = '''async function googleSignIn() {
      errorEl.textContent = "";
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    }'''

new_google = '''async function googleSignIn() {
      errorEl.textContent = "";
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        window.location.href = "index.html";
      } catch (err) {
        errorEl.textContent = friendlyAuthError(err);
      }
    }'''

if old_google in content:
    content = content.replace(old_google, new_google, 1)
    changes_made.append("Google sign-in switched to popup")
elif "signInWithPopup(auth, provider)" in content:
    changes_made.append("Google sign-in already using popup")
else:
    print("WARNING: googleSignIn function not found")

with open('public/account.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Changes made:", changes_made)
