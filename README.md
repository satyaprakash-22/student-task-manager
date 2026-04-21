# TaskMate - Student Task Manager

A full-stack web application for managing personal tasks with deadlines, priorities, and categories. Built with React on the frontend and Node.js + Express on the backend, secured with JWT authentication and deployed on Vercel + Render.

**Live Demo:** [your-app.vercel.app](https://student-task-manager-pink.vercel.app/)  
**Backend API:** [student-task-manager-931x.onrender.com](https://student-task-manager-931x.onrender.com)

---

## Features

### Authentication
- User registration with bcrypt password hashing
- JWT-based login with 7-day token expiry
- Protected routes - unauthenticated users are redirected to login
- Secure logout with localStorage cleanup

### Task Management
- Create tasks with title, description, category, priority, and deadline
- Edit any task inline via the same modal
- Mark tasks as completed with a single click
- Delete tasks
- All task data is user-scoped - users only see their own tasks

### Smart Sorting and Filtering
- Tasks auto-sort by deadline (closest first), then by priority (high → medium → low)
- Completed tasks always pushed to the bottom
- Filter by: All, Pending, Completed, High Priority, Overdue
- Real-time search across title, description, and category

### Deadline Awareness
- Color-coded deadline badges on every card:
  - 🔴 **Overdue** - past deadline
  - 🟠 **Due today / Due tomorrow**
  - 🟡 **2–3 days left**
  - 🟢 **More than 3 days**
- Overdue stat counter turns red when overdue tasks exist
- Overdue filter shows only tasks past their deadline

### UI/UX
- Dark mode toggle (moon/sun) in the navbar - full theme switch via CSS variables
- Priority-colored left border on each task card (red/orange/green)
- Stats bar showing total, pending, completed, overdue, and progress %
- Responsive layout - works on all screen sizes
- Smooth hover effects and transitions throughout

### Pages
- **Dashboard** - task list with stats, search, filter, add/edit/delete
- **Login** - validated login form with inline error messages
- **Register** - validated registration with confirm password check
- **About** - project description and tech stack
- **Contact** - validated contact form with success feedback

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | Component-based UI |
| React Router v6 | Client-side routing and protected routes |
| Axios | HTTP client with base URL configuration |
| Vite | Build tool and dev server |
| CSS3 (custom) | Flexbox layout, CSS variables for theming |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework and router |
| jsonwebtoken | JWT generation and verification |
| bcryptjs | Password hashing and comparison |
| dotenv | Environment variable management |
| fs (built-in) | File-based JSON persistence |

---

## Project Structure

```
student-task-manager/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js          # Register and Login endpoints
│   │   └── tasks.js         # CRUD endpoints for tasks
│   ├── data.json            # Persistent JSON data store
│   ├── server.js            # Express app, CORS, data loading
│   ├── .env                 # JWT_SECRET (not committed)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx   # Navigation bar with dark mode toggle
    │   │   └── TaskCard.jsx # Individual task card component
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── About.jsx
    │   │   └── Contact.jsx
    │   ├── api.js           # Axios instance with base URL
    │   ├── App.jsx          # Router, auth state, dark mode state
    │   ├── main.jsx         # React entry point
    │   └── index.css        # Global styles with CSS variables
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## API Reference

All task endpoints require the `Authorization: Bearer <token>` header.

| Method | Endpoint | Auth | Body | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | `{ name, email, password }` | `201 { message }` |
| POST | `/api/auth/login` | No | `{ email, password }` | `200 { token, user }` |
| GET | `/api/tasks` | Yes | — | `200 [ ...tasks ]` |
| POST | `/api/tasks` | Yes | `{ title, description, priority, deadline, category }` | `201 { task }` |
| PUT | `/api/tasks/:id` | Yes | Any task fields | `200 { task }` |
| DELETE | `/api/tasks/:id` | Yes | — | `200 { message }` |

### Task Object
```json
{
  "id": 1,
  "userId": 1,
  "title": "Complete DSA assignment",
  "description": "Solve problems on Striver sheet",
  "priority": "high",
  "deadline": "2026-04-25",
  "category": "Academics",
  "status": "pending",
  "createdAt": "2026-04-21T10:00:00.000Z"
}
```

### JWT Flow
1. Client sends credentials to `POST /api/auth/login`
2. Server verifies password hash using bcrypt and signs a JWT with the user payload
3. Client stores the JWT in `localStorage`
4. Every subsequent request to `/api/tasks` includes the JWT in the `Authorization` header
5. The `verifyToken` middleware decodes and validates the token before the route handler runs
6. On logout, the token is removed from `localStorage` and the auth state is reset

---

## Running Locally

### Prerequisites
- Node.js v18+
- npm

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```
JWT_SECRET=yoursecretkey
PORT=5000
```

Start the server:
```bash
node server.js
# Server started on port 5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000` automatically via `vite.config.js`.

---

## Deployment

### Backend — Render
1. Push code to GitHub
2. Create a new Web Service on [render.com](https://render.com)
3. Connect your GitHub repository
4. Set Root Directory to `backend`
5. Set Start Command to `node server.js`
6. Add environment variable: `JWT_SECRET = yoursecretkey`
7. Deploy

### Frontend — Vercel
1. Import your GitHub repository on [vercel.com](https://vercel.com)
2. Set Root Directory to `frontend`
3. Framework: Vite (auto-detected)
4. Deploy

Update `frontend/src/api.js` with your Render backend URL:
```js
const API = axios.create({
  baseURL: "https://your-backend.onrender.com",
});
```

---

## Data Persistence

The backend uses a `data.json` file as its data store. On startup, `server.js` reads all users and tasks from this file into memory. After every write operation (register, create task, update task, delete task), the in-memory data is written back to the file using `fs.writeFileSync`.

This approach means:
- Data survives server restarts
- No database setup required
- Simple to inspect and debug

For a production-scale version, this would be replaced with a database like MongoDB or PostgreSQL.

---

## User Flow

> Register → Login → Dashboard with tasks sorted by deadline and priority → Dark mode

---

## Author

**Satya**  
GitHub: [@satyaprakash-22](https://github.com/satyaprakash-22)