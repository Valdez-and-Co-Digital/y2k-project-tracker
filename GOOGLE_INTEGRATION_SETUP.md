# Google Workspace Integration Setup

To fully utilize the **Workspace Hub** (Google Meet, Gmail, Sheets, Calendar, Drive) features in this application, you must configure a Google Cloud Project and link it to your Firebase Authentication setup.

Follow these steps carefully:

## 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click the project dropdown at the top and select **New Project**.
3. Name it (e.g., `Y2K Project Tracker`) and click **Create**.
4. Make sure your newly created project is selected in the top dropdown.

## 2. Enable Required APIs
You need to enable the specific Google Workspace APIs the app uses.
1. Go to **APIs & Services > Library** from the left navigation menu.
2. Search for and **Enable** the following APIs one by one:
   - **Google Meet API**
   - **Gmail API**
   - **Google Sheets API**
   - **Google Calendar API**
   - **People API** (for Contacts)
   - **Google Drive API**

## 3. Configure the OAuth Consent Screen
1. Go to **APIs & Services > OAuth consent screen**.
2. Choose **External** (or Internal if you have a Google Workspace org) and click **Create**.
3. Fill in the required details:
   - **App Name:** Y2K Project Tracker
   - **User Support Email:** Your email address
   - **Developer Contact Info:** Your email address
4. Click **Save and Continue**.
5. **Scopes:** You must add the following sensitive scopes:
   - `https://www.googleapis.com/auth/meetings.space.created`
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/spreadsheets`
   - `https://www.googleapis.com/auth/contacts.readonly`
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/drive.file`
6. Click **Save and Continue**.
7. Add yourself as a **Test User** (if the app is still in testing mode).

## 4. Get Your Client ID
1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials** -> **OAuth client ID**.
3. Application Type: **Web application**.
4. Name: `Y2K Tracker Web Client`.
5. **Authorized JavaScript origins:** Add your deployed Vercel URL (e.g., `https://my-y2k-tracker.vercel.app`) and `http://localhost:5173` for local development.
6. **Authorized redirect URIs:** Add your Firebase project's Auth domain (e.g., `https://your-project-id.firebaseapp.com/__/auth/handler`).
7. Click **Create** and copy your **Client ID**.

## 5. Configure Firebase Authentication
1. Go to the [Firebase Console](https://console.firebase.google.com/) for your project.
2. Go to **Authentication > Sign-in method**.
3. Enable the **Google** provider.
4. Under the Web SDK configuration for the Google provider, ensure your **Web client ID** matches the Client ID you created in Google Cloud Console. 
5. Also, in your codebase, ensure `firebase-applet-config.json` contains the correct Firebase config variables (apiKey, authDomain, projectId, etc.).
6. Update `src/lib/firebase.ts` if needed to request the correct scopes during sign-in:
   ```javascript
   provider.addScope('https://www.googleapis.com/auth/meetings.space.created');
   provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
   // ... add all other scopes
   ```

## 6. Deployment on Vercel
1. Commit and push your code to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Ensure the Build Command is `npm run build` and the Output Directory is `dist`.
5. Add any environment variables (e.g., `VITE_FIREBASE_API_KEY`) if you moved your config to `.env`.
6. Click **Deploy**.

Once deployed, make sure to add the Vercel URL to your Google Cloud Console's **Authorized JavaScript origins** and Firebase Console's **Authorized domains**.
