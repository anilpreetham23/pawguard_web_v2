# 04. Google Account Integration

PawGuard supports instant sign-in using your existing Google account for maximum convenience and security.

---

## 1. How to Sign In with Google

1. Open the Sign In / Sign Up dialog on the website.
2. Click the **Continue with Google** button at the top of the dialog.
3. A secure Google authorization window will open:
   * Select your Google account.
   * Review the permissions (PawGuard requests basic profile info: email, full name, and avatar photo).
4. Click **Continue** / **Allow**.
5. Google will securely return you to PawGuard at `/auth/callback`, where your session is established automatically.

---

## 2. Benefits of Google Sign-In

* **No Password to Remember:** Sign in instantly with one click.
* **Automatic Profile Sync:** Your full name, email address, and Google profile picture are automatically synced to your PawGuard profile.
* **Instant Account Setup:** If you don't have a PawGuard account yet, signing in with Google creates one for you automatically.

---

## 3. Privacy & Security

* PawGuard **NEVER** receives or stores your Google password.
* Sign-in uses OAuth 2.0 with state token verification to prevent unauthorized account access.
* You can disconnect or manage app permissions at any time through your Google Account security settings.
