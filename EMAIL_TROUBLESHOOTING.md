# Email Configuration & Troubleshooting Guide

## 🚀 Quick Fix Summary

The email sending on `/send-exam` page has been enhanced with:
- **Better error messages** showing exactly what went wrong
- **Improved logging** in the backend for debugging
- **Email Configuration Tester** page to diagnose issues
- **Helpful troubleshooting tips** displayed to admins
- **Better error handling** for SMTP authentication and connection failures
- **403 Forbidden error handling** with CSRF protection fixes
- **Network error detection** with backend connectivity checks

---

## 🔴 Network Error 403: Forbidden

### What is a 403 Error?

**HTTP 403 Forbidden** means the server received your request but refused to process it. This is usually due to:
1. **CSRF Token Missing** - Django security check failing
2. **CORS Issues** - Cross-origin request blocked
3. **Missing Permissions** - User doesn't have access

### How to Fix 403 Error

#### Step 1: Restart Django Server
The CSRF middleware fix needs Django to reload.

```bash
# Kill the running Django process
# Then restart:
cd backend
python manage.py runserver
```

#### Step 2: Clear Browser Cache
CSRF tokens may be cached.

1. Open DevTools (F12)
2. Right-click refresh button → "Empty cache and hard refresh"
3. Try sending email again

#### Step 3: Verify Backend is Running

1. Open browser console (F12)
2. Look for messages like `[API REQUEST]` or `[API ERROR]`
3. Check that backend responds to: `http://127.0.0.1:8000/`
4. If you see **Network Error**, backend is offline

#### Step 4: Check CORS Configuration

**If still getting 403 after restart:**

1. Go to `/email-config` page (Admin Dashboard → Email Configuration)
2. Click "Test Email Configuration"
3. If you see connection errors, CORS issues exist
4. Verify `backend/backend/settings.py` has:
   ```python
   CORS_ALLOW_ALL_ORIGINS = True
   ```

#### Step 5: Complete Cache Clear

Sometimes browser caches old CSRF tokens:

```javascript
// Open browser console and run:
window.location.href = window.location.href.replace(/#.*/, '') + '?nocache=' + Date.now();
```

---

## 🔍 Testing Network Connection

### From Browser Console

```javascript
// Test if backend is accessible
fetch('http://127.0.0.1:8000/api/courses/')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.log('❌ Backend ERROR:', e.message));
```

Expected output:
- ✅ **Success**: Response with course data or empty array
- ❌ **Error**: Network error, CORS error, or 404

### From Terminal

```bash
# Test backend API
curl http://127.0.0.1:8000/api/courses/

# Or with POST
curl -X POST http://127.0.0.1:8000/api/exams/send-exam/ \
  -H "Content-Type: application/json" \
  -d '{"student_name":"Test","student_email":"test@example.com","course_title":"Python"}'
```

---

## 📋 All Error Codes & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **403 Forbidden** | CSRF/Permission issue | Restart Django, clear cache |
| **404 Not Found** | API endpoint wrong | Check URL, restart Django |
| **500 Server Error** | Code error in backend | Check Django console logs |
| **Network Error** | Backend offline | Start Django server |
| **ECONNREFUSED** | Connection refused | Check backend running on 8000 |
| **Gmail Auth Failed** | Wrong password | Use app password, not regular password |
| **SMTP Connection Failed** | Port/firewall blocked | Check port 587, try port 465 |

---

## ⚠️ Common Email Issues & Solutions

### Issue 1: "Gmail authentication failed"

**Cause:** Gmail requires an app-specific password, not your regular password.

**Solution:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Google will generate a 16-character password
4. Copy this password
5. Update `backend/.env`:
   ```
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=xxxx xxxx xxxx xxxx
   ```
6. Restart Django server

### Issue 2: "Connection refused" or "Connection timeout"

**Cause:** Firewall or network issue blocking SMTP port 587.

**Solution:**
1. Check your internet connection
2. Check if your firewall allows outbound traffic on port 587
3. If behind corporate firewall, ask IT to unblock SMTP
4. Try using port 465 with SSL (requires changing EMAIL_PORT to 465 and EMAIL_USE_SSL to True)

### Issue 3: "Invalid credentials" or "535 Authentication failed"

**Cause:** Wrong email or app password in .env file.

**Solution:**
1. Double-check the email address is exactly correct (including case if applicable)
2. Regenerate the app password at https://myaccount.google.com/apppasswords
3. Ensure you copied the entire 16-character password without spaces (it auto-inserts spaces but they're not needed)
4. Verify the .env file has no extra quotes or special characters

---

## 🧪 How to Test Email Configuration

1. Go to **Admin Dashboard → Email Configuration**
2. Click **"🧪 Test Email Configuration"**
3. You'll see:
   - Email backend being used
   - SMTP host and port
   - Connection status
   - Any errors with solutions

---

## 📧 New Features Added

### 1. **Better Error Messages on /send-exam**
- Shows authentication errors with solutions
- Shows connection errors with troubleshooting steps
- Displays backend errors with debugging info

### 2. **Email Configuration Tester Page**
- New route: `/email-config` (admin only)
- Test SMTP connection without sending email
- View full email configuration
- Show setup instructions for Gmail

### 3. **Improved Backend Logging**
- Detailed logs in Django console for email operations
- Easy to identify where email sending fails
- Timestamps and context for each operation

### 4. **Better Error Handling**
- Catches specific SMTP errors
- Distinguishes between auth, connection, and other errors
- Provides actionable solutions in error messages

---

## 📝 Email Configuration (.env)

```
# Email settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
EMAIL_TIMEOUT=30
FRONTEND_URL=http://localhost:5173
```

---

## 🔍 Debugging Steps

If email still doesn't work:

1. **Check backend logs** - Look for `[EMAIL LOG]` messages
2. **Test email config** - Use the new `/email-config` page
3. **Verify .env file** - Make sure all settings are correct
4. **Restart Django** - Session might be cached
5. **Check Gmail account**:
   - 2FA enabled?
   - App password generated?
   - Account allows "Less secure apps"? (not needed with app password)

---

## 🚀 Workflow for Sending Exam Mail

1. Admin goes to `/send-exam`
2. Enters student details or uploads CSV
3. Selects course
4. Clicks "Send Exam"
5. If email fails, error message shows reason + solution
6. Admin can either:
   - Fix the configuration and retry
   - Go to `/email-config` to test
   - Check console logs for more details

---

## 📱 New Pages Added

### `/email-config` (Admin Only)
- Test email configuration
- View setup instructions
- Quick troubleshooting guide

### `/issued-certificates` (Admin Only)
- View all issued certificates
- Search certificates
- Download certificate files

---

## 💡 Pro Tips

1. **Use an app password, not your Gmail password** - More secure and required by Gmail
2. **Keep .env secure** - Never commit it to Git
3. **Test after changes** - Always use `/email-config` to verify
4. **Check console logs** - Most issues are visible in Django console output
5. **For production** - Consider using a dedicated email service (SendGrid, Mailgun, AWS SES)

---

## 📞 Support

If you still have issues:
1. Check Django console for error logs (prefixed with [EMAIL LOG], [ERROR], [AUTH ERROR])
2. Visit `/email-config` and click "Test Email Configuration"
3. Review the troubleshooting guide on that page
4. Check that your Gmail account has 2FA enabled and app password generated
