

# Plan: Simple Login with Forgot Password & Remove Lovable Branding

## What's changing

1. **Remove Lovable badge** — Hide the Lovable watermark/badge from the preview using the publish settings tool.

2. **Enable auto-confirm emails** — So users can sign up and log in immediately without email verification. This makes the auth flow simple and direct.

3. **Add Forgot Password flow** — Two new components:
   - Add a "Forgot password?" link on `Login.tsx` that shows an email input and calls `supabase.auth.resetPasswordForEmail()` with redirect to `/reset-password`
   - Create `src/pages/ResetPassword.tsx` — checks for recovery token in URL, shows a "Set new password" form, calls `supabase.auth.updateUser({ password })`

4. **Add `/reset-password` route** in `App.tsx` as a public route

## Files

| Action | File |
|--------|------|
| Modify | `src/pages/Login.tsx` — Add forgot password link + inline reset request form |
| Create | `src/pages/ResetPassword.tsx` — New password form after clicking reset link |
| Modify | `src/App.tsx` — Add `/reset-password` route |
| Tool | `configure_auth` — Enable auto-confirm email signups |
| Tool | `set_badge_visibility` — Hide Lovable badge |

