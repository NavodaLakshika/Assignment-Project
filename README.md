# FeedPulse - AI-Powered Product Feedback Platform

FeedPulse is a lightweight, full-stack internal tool designed to help product teams collect, analyze, and manage user feedback effortlessly. Utilizing **Google Gemini AI**, the platform automatically categorizes incoming feedback, assigns priority scores, performs sentiment analysis, and generates smart summaries, giving product teams instant clarity on what to build next.

It features a public-facing feedback submission form and a secure, beautifully designed glassmorphic Admin Dashboard for product managers.

---

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS v4, Lucide React Icons
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB (with Mongoose ODM)
- **AI Integration:** Google Gemini API (gemini-1.5-flash)
- **DevOps:** Docker, Docker Compose

---

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables.

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_ai_studio_api_key
JWT_SECRET=your_jwt_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

### Frontend (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 💻 How to Run Locally

### Approach 1: Standard Node.js Setup

1. **Clone the repository** (if applicable)
2. **Setup the Database:**
   - Create a MongoDB Atlas cluster and add you IP to Network Access.
   - Or, run a local instance of MongoDB.
3. **Configure Environment Variables:**
   - Create a `.env` file inside the `/server` directory and paste in the required variables above.
4. **Install Dependencies & Start Backend:**
   ```bash
   cd server
   npm install
   npm run dev
   ```
5. **Install Dependencies & Start Frontend:**
   - Open a *new* terminal window.
   ```bash
   cd client
   npm install
   npm run dev
   ```
6. **Access the App:**
   - Public Feedback Portal: `http://localhost:3000`
   - Admin Login: `http://localhost:3000/admin/login`

### Approach 2: Docker Compose (Bonus Task 1)

If you have Docker installed, you can spin up the entire application (Frontend + Backend + Database) effortlessly:

1. Ensure Docker Desktop is running.
2. At the root folder of the project, run:
   ```bash
   docker-compose up --build
   ```
3. The app will be available on `http://localhost:3000`.

---

## 🌟 Key Features Implemented

**Public Feedback Form:**
- Fully responsive, accessible form for users.
- Client-side and server-side validation (Min 20 characters logic).
- Interactive Character counter UI.
- Feedback is gracefully saved even if the AI engine is momentarily offline.

**AI Integration (Gemini 1.5 Flash):**
- Strict JSON-based analysis of user text.
- Parses unstructured data into valid Enum categories (Bug, Feature Request, Improvement).
- Scores priority from 1-10 iteratively.
- Sentiments dynamically color-code on the Admin dashboard.

**Admin Dashboard:**
- Protected via JSON Web Token (JWT) based login mechanism.
- Modern Glassmorphic UI with visually distinct AI neural badge.
- Real-time status updates (New -> In Review -> Resolved).
- Robust Database-level pagination and filtering.

---

## 🔮 What's Next (Future Roadmap)

If I had more time to expand this project, I would focus on the following:

1. **Email Notifications:** Integrate SendGrid or AWS SES to instantly alert the submitter (if they provided an email) when the status of their feedback gets updated to "Resolved".
2. **Weekly Summary Cron Job:** Implement a background cron job that emails product managers a Gemini-generated summary of the "Top 3 themes from the week".
3. **Advanced Rate Limiting:** Enhance the current API rate limiter by moving state onto Redis for better multi-instance horizontal scaling.
4. **OAuth 2.0:** Move away from hardcoded Admin variables and implement Google or GitHub SSO via NextAuth for product team members.

---

*Good luck building great products!*
