<<<<<<< HEAD
4th Semster Project
# Developer Portfolio
=======
Muhammad Junaid — Developer Portfolio
Roll No: [F24BDOCS1M01019]
Course: Web Technologies SP26 — BSCS 4th Semester
Sections: 1M 

Project Description
A full-stack portfolio web application built with plain JavaScript and JSON Server as a mock REST backend. The app has two panels:

index.html — Public-facing portfolio showing projects, skills, about section, and a contact/suggestion form.
admin.html — Admin control panel for managing portfolio projects with full CRUD operations and live statistics.


Technology Stack
LayerTechnologyMarkupHTML5 (semantic tags)StylingBootstrap 5 + JavaScriptPlain JS (no frameworks)BackendJSON Server (mock REST API)DataJSON via fetch + async/await

Features
User Panel (index.html)

Fetches and displays projects dynamically from JSON Server (GET)
Filter projects by category (dropdown)
Contact / suggestion form with 5 input fields
Inline form validation — no alert() popups, no browser default validation
Loading spinner while fetching, error message if server unreachable
List re-renders automatically after successful form submission

Admin Panel (admin.html)

Fetch and display all projects (GET)
Add new project (POST) with inline validation
Edit existing project — loads into form, saves with PUT
Delete project with confirmation dialog (DELETE)
3 live statistics: Total Projects, Web/Frontend count, JS Projects count
Search by title or technology
Filter by category (ALL / FRONTEND / JS / WEB)
Visually distinct from user panel (dark theme, admin badge)
Toast notifications instead of alert() popups


Installation & Setup
Prerequisites

Node.js installed (v14+)
A code editor (VS Code recommended)
VS Code Live Server extension

Step 1 — Install JSON Server
Open your terminal and run:
bashnpm install -g json-server
Step 2 — Clone / Extract Project
Extract the zip file and navigate into the project folder:
bashcd WebProject_[F24BDOCS1M01019]
Step 3 — Start JSON Server
bashnpx json-server --watch db.json
You should see:
Resources
  http://localhost:3000/projects
  http://localhost:3000/suggestions
Keep this terminal window open.
Step 4 — Open the App

Open index.html with VS Code Live Server (right-click → Open with Live Server)
OR open directly: http://127.0.0.1:5500/index.html
Admin panel: http://127.0.0.1:5500/admin.html


Project Structure
WebProject_[F24BDOCS1M01019]/
├── index.html          — User-facing portfolio page
├── admin.html          — Admin CRUD control panel
├── index.js            — User panel JavaScript (GET, POST, filter, validation)
├── admin.js            — Admin panel JavaScript (GET, POST, PUT, DELETE, stats)
├── style.css           — Minimal custom CSS overrides (Bootstrap is primary)
├── db.json             — JSON Server data file (projects + suggestions)
├── README.md           — This file
└── images/
    ├── Profile-picture.jpeg
    ├── Student-Portal.png
    ├── Quiz-App.png
    └── University-Registration-Form.png

HTTP Methods Used
Method   Where Used         Purpose
GET      index.js,admin.js  Load all projects
POST     index.js           Submit contact/suggestion form
POST     admin.js           Add new project
PUT      admin.js           Update existing project
DELETE   admin.js           Remove a project

Screenshots


screenshots/user-panel.png
screenshots/admin-panel.png
screenshots/form-validation.png


Submission Checklist

 index.html — user panel
 admin.html — admin panel
 index.js — user JS
 admin.js — admin JS
 style.css — styling
 db.json — JSON Server data file
 README.md — this file
 npx json-server --watch db.json works
 No node_modules in zip
 No hardcoded arrays for main data
 Name and roll number in README


Author
Muhammad Junaid
Roll No: F24BDOCS1M01019
GitHub: github.com/muhammadjunaid73
Email: rajunaid73@gmail.com
>>>>>>> 4b1dfad (first commit)
