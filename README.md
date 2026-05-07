# 🏢 Hostel Management System

A comprehensive, full-stack web application designed to simplify and automate the management of hostel operations. Built with the **MERN** stack (MongoDB, Express.js, React, Node.js) and fully containerized using **Docker** for seamless CI/CD deployment on AWS EC2.

---

## 🚀 Features & Capabilities

### 📊 Dynamic Dashboard & Activity Logging
- Provides an at-a-glance overview of total students, available rooms, and rooms under maintenance.
- **Color-Coded Activity Log:** Tracks every action performed in the system in real-time.
  - 🟢 **Green (Available/Success):** New student registrations and simple profile updates.
  - 🟡 **Yellow (Maintenance/Warning):** A student was reassigned and moved to a new room.
  - 🔴 **Red (Full/Danger):** A student was permanently removed/deleted from the hostel.

### 👥 Student Management (CRUD)
- Fully functional system to add new students, update their profiles, reassign their rooms, and remove them when they leave.

### 🚪 Automated Room Allocation
- The system intelligently manages room capacities to prevent over-booking.
- Adding a student to a room automatically decreases its availability. It marks the room as "Full" when capacity is reached, and automatically frees up space when a student is removed or reassigned.
- **Maintenance Lock:** Prevents assigning any students to rooms currently marked for "Maintenance".

### 📅 Daily Attendance Tracking
- A dedicated portal to mark students as Present, Absent, or on Leave for any given date. 
- **Smart Sorting:** The list dynamically sorts students numerically by room number to make physical room-to-room inspections easier. 
- Students without assigned rooms are automatically pushed to the bottom of the list and restricted from having attendance marked until properly assigned.

### 🔒 Secure Administrator Access
- Protected by JSON Web Tokens (JWT) for secure session management. 
- Passwords and login credentials can be securely updated directly from the Settings page.

---

## 📁 Folder Structure Explained

This repository is split into three main parts:

- **`/frontend`**: Contains the React application (Vite). It handles the user interface, routing, and styling (Glassmorphism CSS). It also includes its own `Dockerfile` using Nginx to serve the built files in production.
- **`/backend`**: Contains the Express.js Node server and Mongoose models (`Student`, `Room`, `Admin`, `Activity`, `Attendance`). It connects to MongoDB Atlas and serves REST APIs. It includes its own `Dockerfile` to run the backend on port 5000.
- **`/.github/workflows`**: Contains the GitHub Actions automation scripts.
  - `ci.yml`: Automatically tests and builds the Docker images when code is pushed.
  - `cd.yml`: Automatically SSHs into the live AWS EC2 server, pulls the latest Docker images, and restarts the live website.

---

## 💻 Local Setup Guide (For Developers)

If you want to download this repository and run it locally on your own computer, follow these exact steps:

### Prerequisites
- Node.js (v18 or higher) installed on your PC.
- A MongoDB Atlas account (or local MongoDB server).

### 1. Clone the Repository
```bash
git clone https://github.com/RamBaranwal/hostelManagmanet.git
cd hostelManagmanet
```

### 2. Setup the Backend
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```
Create a new `.env` file inside the `backend` folder and add your database credentials:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.zp3vwck.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_key_here
```
*(Note: Replace `<username>` and `<password>` with your actual MongoDB credentials. Ensure your current IP Address is whitelisted in your MongoDB Atlas Network settings!)*

Start the backend server:
```bash
npm run dev
```
If successful, you will see `Hostel Management API is running perfectly!` and `Connected to MongoDB Atlas` in the terminal.

### 3. Setup the Frontend
Open a **new** separate terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Start the frontend React application:
```bash
npm run dev
```

The terminal will give you a local link (usually `http://localhost:5173`). Open that in your browser, log in using the default credentials (`admin` / `admin123`), and the app is yours to use!

---

## 🛠️ Technology Stack
- **Frontend:** React, Vite, CSS (Glassmorphism UI), Lucide Icons, Axios.
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT).
- **Database:** MongoDB Atlas & Mongoose.
- **Infrastructure:** Docker, Nginx, AWS EC2, GitHub Actions (CI/CD).
