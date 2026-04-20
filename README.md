FinTrack — Student Finance Tracker

A personal finance tracker built for college students. Log expenses, set monthly budgets, split bills with friends, and understand your spending — all in one place.

Problem Statement

College students manage money across unpredictable categories — hostel rent, food, travel, subscriptions, and spontaneous outings. Most finance tools are either too complex or not built with a student's reality in mind.

FinTrack is designed specifically for students who:

Get a fixed monthly allowance or stipend
Split expenses with friends and lose track of who owes what
Overspend on certain categories without realising it
Want a clear picture of where their money goes each month


Features

Dashboard — Monthly summary with total spent, budget remaining, daily spending chart, category breakdown, and recent transactions
Expenses — Add, edit, and delete transactions across 8 categories with search, filter, and sort
Budget Planner — Set monthly limits per category with live progress bars and over-budget alerts
Splits — Record shared expenses, auto-calculate per-person share, and mark friends as settled
Insights — 6-month spending trends, category breakdown, and budget vs actual radar chart
Authentication — Email/password signup and login with protected routes


Tech Stack

React 18 — Functional components, hooks, Context API, React.lazy + Suspense
React Router v6 — Client-side routing and protected routes
Firebase Auth — Email/password authentication
Firebase Firestore — NoSQL database with full CRUD
Recharts — Area, Bar, Pie, and Radar charts
react-hot-toast — Toast notifications
date-fns — Date formatting and manipulation
CSS Variables — Black and gold design system


Project Structure
student-finance-tracker/
├── src/
│   ├── context/
│   │   ├── AuthContext.js        # Firebase auth state
│   │   └── FinanceContext.js     # Global expenses, budgets, splits state
│   ├── services/
│   │   ├── firebase.js           # Firebase initialisation
│   │   └── expenseService.js     # Firestore CRUD operations
│   ├── hooks/
│   │   └── useExpenseForm.js     # Custom form hook with validation
│   ├── components/
│   │   ├── ProtectedRoute.js
│   │   ├── Sidebar.js
│   │   └── ExpenseModal.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Dashboard.js
│   │   ├── Expenses.js
│   │   ├── Budget.js
│   │   ├── Splits.js
│   │   └── Insights.js
│   ├── App.js
│   └── index.css
├── .env                          # Local only — never commit
├── .env.example                  # Safe placeholder — commit this
└── package.json

Setup Instructions
1. Clone the repo
bashgit clone https://github.com/YOUR_USERNAME/student-finance-tracker.git
cd student-finance-tracker
2. Install dependencies
bashnpm install
3. Set up Firebase

Go to console.firebase.google.com and create a new project
Enable Authentication → Sign-in method → Email/Password
Enable Firestore Database → Start in test mode
Go to Project Settings → Your Apps → Web App → copy the config

4. Configure environment variables
bashcp .env.example .env
Open .env and fill in your Firebase config:
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
5. Add Firestore security rules
In Firebase Console → Firestore → Rules, paste:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
6. Run locally
bashnpm start
Open http://localhost:3000, create an account, and you're in.

Deployment
This project can be deployed to Vercel or Netlify.
When deploying, add all REACT_APP_FIREBASE_* variables from your .env in the platform's environment variables settings. Do not upload the .env file itself.

Environment Variables
Never commit your .env file — it is listed in .gitignore. The .env.example file contains placeholder keys and is safe to push to GitHub. Anyone cloning this repo should copy it and fill in their own Firebase credentials.Share