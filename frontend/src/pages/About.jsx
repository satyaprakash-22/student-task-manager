import React from "react";

function About() {
  return (
    <div className="page-content">
      <h2>About TaskMate</h2>
      <p>
        TaskMate is a full-stack web application built as a Course Based Project for the
        Web Application Development lab (22SD5IT201). It helps students organize and
        track their daily academic tasks efficiently.
      </p>
      <p>
        The application supports user registration and login with JWT authentication,
        full CRUD operations on tasks, task priority levels, completion tracking,
        and a clean dashboard with task statistics.
      </p>
      <p>Technologies used in this project:</p>
      <div className="tech-grid">
        <span className="tech-badge">React</span>
        <span className="tech-badge">React Router</span>
        <span className="tech-badge">Node.js</span>
        <span className="tech-badge">Express.js</span>
        <span className="tech-badge">JWT</span>
        <span className="tech-badge">REST API</span>
        <span className="tech-badge">ES6</span>
        <span className="tech-badge">Axios</span>
        <span className="tech-badge">Vite</span>
      </div>
    </div>
  );
}

export default About;