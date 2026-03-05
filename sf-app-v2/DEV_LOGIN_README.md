# Dev login / OTP bypass (outdated)

**The in-app dev bypass has been removed for production.** When `API_URL` is set in `.env`, the app uses real login and OTP only. The content below is kept for historical reference.

---

## (Previously) Where to tap “[Dev] Skip login”

## 1. Where to tap “[Dev] Skip login”

- **SignupScreen:** App → Login/Signup screen (where you pick country and enter phone).
- **OnboardingAuthModal:** The bottom sheet that asks for phone on the onboarding flow.

You’ll see a grey **“[Dev] Skip login”** link under the **“Get OTP”** button **only in debug builds** (`__DEV__` is true). Tap it once to log in with the dev account.

---

## 2. What the app does when you tap it

- It **does not** call “Get OTP” (no SMS, no rate limit used).
- It calls **only** `POST /member/auth/verify-otp` with:
  - `phone`: value of `DEV_BYPASS_PHONE` (see below)
  - `otp`: value of `DEV_BYPASS_OTP` (see below)
- If the backend returns a valid token, the app stores it and navigates to Home (or shows the name modal if the user has no name).

---

## 3. Configure dev phone and OTP in the app

In **`constant/constant.ts`**:

- **`DEV_BYPASS_PHONE`** – Dev phone number (e.g. `"+971500000000"`). Must match what your backend treats as the dev number.
- **`DEV_BYPASS_OTP`** – Dev OTP (e.g. `"1234"`). Must match what your backend accepts for that dev number.

Change these to whatever your backend expects for dev login.

---

## 4. What the backend must do

For “[Dev] Skip login” to work **and** to avoid “Maximum OTP send attempts reached”:

**Option A (recommended)**  
In **development**, for the dev phone number (e.g. `+971500000000`):

- **`POST /member/auth/verify-otp`** with that phone and the dev OTP (e.g. `1234`) must:
  - Accept the request **without** requiring a prior `login` (no “request OTP first”).
  - Return a valid `accessToken` (and `zegoToken`, `envs` as you already do).

So the backend treats this number + OTP as a special dev case and issues a token without ever sending or counting an OTP.

**Option B**  
If you keep “must call login before verify-otp”:

- For the **dev phone number only**, do **not** send a real SMS and do **not** increment the “OTP send attempts” counter (or use a much higher limit for that number). Then:
  - User taps “Get OTP” once with the dev number (or you use a test that calls `login` once).
  - User taps “[Dev] Skip login” (which only calls `verifyOtp`), or enters the dev OTP manually.
- After that, use “[Dev] Skip login” only (no more “Get OTP”) so you don’t hit the limit again.

---

## 5. “Maximum OTP send attempts reached. Please try again later.”

This comes from your **backend** when the app (or you) has called the **login** (or “send OTP”) endpoint too many times.

**Right now:**

1. **Wait** for the backend cooldown (e.g. 15–60 minutes), or  
2. **Ask backend** to reset the OTP attempt counter for your IP/phone, or  
3. **Ask backend** to whitelist the dev phone number so it doesn’t count toward the limit.

**From now on:**

- Use **“[Dev] Skip login”** instead of “Get OTP” when testing. The app now **only** calls `verify-otp` for dev login, so it does **not** trigger “send OTP” and won’t increase the attempt counter.
- If your backend still requires a prior `login` for that number, implement **Option A** or **Option B** above so dev login works without repeatedly sending OTP.

---

## 6. Quick checklist

- [ ] In `constant/constant.ts`, set `DEV_BYPASS_PHONE` and `DEV_BYPASS_OTP` to the values your backend uses for dev.
- [ ] Backend in dev: for that phone + OTP, either (A) accept `verify-otp` without prior `login`, or (B) don’t count/send OTP for that number.
- [ ] If you’re currently blocked: wait for cooldown or get backend to reset/whitelist the dev number.
- [ ] Run the app in **debug** (so `__DEV__` is true), open the Login/Signup or onboarding phone screen, and tap **[Dev] Skip login** once.
