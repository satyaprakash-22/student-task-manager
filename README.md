# TaskMate – Student Task Manager

A full-stack web application for students to manage their daily tasks.
Built as a Course Based Project for 22SD5IT201 – Web Application Development.

## Features

- User registration and login with JWT authentication
- Add, complete, and delete tasks
- Priority levels: High, Medium, Low
- Filter tasks by status and priority
- Task statistics on dashboard
- Client-side form validation
- Protected API routes using JWT middleware
- React SPA with React Router (Login, Register, Dashboard, About, Contact)

## Tech stack

- **Frontend**: React, React Router, Axios, Vite
- **Backend**: Node.js, Express.js, JWT, bcryptjs
- **Data storage**: In-memory (no DB setup needed)

## Lab syllabus coverage

| Exercise | Covered by |
|---|---|
| Ex 1, 2 | React pages with responsive CSS, Bootstrap-style layout |
| Ex 3 | JS client-side validation on all forms |
| Ex 4 | ES6 arrow functions, async/await, Axios API calls |
| Ex 9 | Custom Express HTTP server with Node.js modules |
| Ex 10 | REST API with full CRUD on tasks |
| Ex 11 | JWT auth on protected endpoints |
| Ex 12 | React SPA with React Router and multiple pages |
| Ex 14 | React components, deployable to GitHub |

## How to run

### Backend
cd backend
npm install
node server.js

### Frontend (new terminal)
cd frontend
npm install
npm run dev

Open http://localhost:5173 in your browser.