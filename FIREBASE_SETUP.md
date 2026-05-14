# Firebase Google Authentication Setup Guide

This guide explains how to complete the Firebase Google authentication setup for the login and signup pages.

## What's Been Implemented

✅ **Login Page** (`src/components/Login.jsx`)
- Google Sign-in button with Firebase authentication
- Email/password form (backend implementation ready)
- Error handling with user-friendly messages
- Loading states to prevent duplicate submissions
- Navigation to home after successful login

✅ **Signup Page** (`src/components/Signup.jsx`)
- Google Sign-up button with Firebase authentication
- Email/password signup with validation
- Full name input for user profile
- Password confirmation validation
- Minimum password length check (6 characters)
- Navigation to home after successful signup

✅ **Firebase Configuration** (`src/firebase.js`)
- Auth service initialized and exported
- Ready to use in components

## Setup Steps

### Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create one)
3. Click **Project Settings** (gear icon)
4. Go to **Your apps** section
5. Select your Web app (or create one)
6. Copy the Firebase configuration values

### Step 2: Configure Environment Variables

1. Create a `.env` file in the `frontend/` directory:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Fill in the `.env` file with your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### Step 3: Enable Google Sign-In in Firebase

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method**
4. Enable **Google** provider
5. Select or create a Google Cloud project
6. Configure the consent screen if needed

### Step 4: Test the Implementation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login` or `/signup`
3. Click the Google button
4. You should see the Google sign-in popup
5. After successful authentication, you'll be redirected to the home page

## How It Works

### Login Flow
1. User clicks the **Google Sign-in** button
2. Firebase shows a Google login popup
3. User authenticates with their Google account
4. Firebase returns user data (name, email, profile picture)
5. User is automatically logged in and redirected

### Signup Flow
1. User can either:
   - Click **Continue with Google** for instant signup
   - Fill in email/password form manually
2. For Google: Same as login flow
3. For email/password:
   - Validates all required fields
   - Checks password confirmation matches
   - Validates password is at least 6 characters
   - Creates Firebase user account
   - Updates user profile with full name
   - Redirects to home page

## Features Included

✅ Error handling for:
- Missing Firebase configuration
- Popup blocked by browser
- User cancelling authentication
- Email already in use
- Invalid email format
- Weak password

✅ User experience:
- Loading states prevent multiple submissions
- Clear error messages
- Disabled buttons during processing
- Easy switching between login/signup

## Next Steps (Optional)

### 1. Add Authentication State Management
Create an Auth Context to track logged-in user globally:
```javascript
// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### 2. Add Protected Routes
Guard routes to only allow authenticated users

### 3. Add Email/Password Login
Implement `handleEmailLogin` in Login component

### 4. Add Other Providers
Implement Twitter or GitHub authentication following the same pattern

## Troubleshooting

### "Firebase is not initialized" Error
- Check that `.env` file exists in `frontend/` directory
- Verify all required Firebase variables are set
- Restart the dev server after updating `.env`

### Popup Won't Open
- Check browser popup blocker settings
- Ensure using `http://localhost` for development
- Check browser console for error messages

### Wrong Email or Account?
- Clear browser cookies for Firebase domain
- Try signing in with the correct account

## File Modifications Summary

| File | Changes |
|------|---------|
| `src/firebase.js` | Added Auth initialization |
| `src/components/Login.jsx` | Added Google auth handler and form state |
| `src/components/Signup.jsx` | Added Google auth handler and email/password signup |

## Security Notes

- Firebase credentials in `.env` are safe (prefixed with `VITE_` makes them public in frontend)
- No sensitive data should be stored in frontend environment variables
- Always use Firebase Security Rules for backend protection
- Enable CORS properly in backend if using API

---

For more information, visit:
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
