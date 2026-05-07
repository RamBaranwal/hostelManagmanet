# Hostel Management System (MERN Stack)

This is a full-stack Hostel Management System built with MongoDB, Express.js, React, and Node.js. It features a modern, premium UI with a dark mode glassmorphism design.

## Features
- **Dashboard**: Overview of total students, available rooms, and recent activity.
- **Student Management**: Add, view, and delete student records.
- **Room Management**: Monitor room occupancy and maintenance status.

## Project Structure
- `backend/`: Node.js + Express API server
- `frontend/`: React + Vite client application

## Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Open `backend/.env` and replace `<username>` and `<password>` with your MongoDB Atlas cluster credentials:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hosteldb?retryWrites=true&w=majority
   ```
   *(To get the URI, go to MongoDB Atlas -> Connect -> Connect your application)*
3. Start the backend server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open your browser to the provided local URL (usually `http://localhost:5173/`).

## Note
The frontend is built to gracefully handle the absence of the backend by utilizing mock data, allowing you to preview the stunning UI immediately even before setting up MongoDB!
