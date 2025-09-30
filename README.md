# Notes App – Full Stack Project

A modern **full-stack Notes application** built with **React (Vite)**, **TypeScript**, **Express.js**, and **MongoDB**.  
The project demonstrates **OTP-based authentication**, **Google OAuth login**, and secure **JWT-based session handling**, making it ideal as a production-ready reference for user authentication and CRUD operations.

## 🚀 Features

- **User Authentication**
  - Email + OTP-based sign-up & sign-in
  - Google OAuth 2.0 integration
  - JWT-based authentication (stateless & secure)
- **Notes Management**
  - Create, Read, Update, Delete (CRUD) notes
  - Notes tied to authenticated users only
  - Responsive Dashboard with a clean UI
- **Modern UI/UX**
  - Figma-inspired design
  - Floating/inline label input fields
  - Mobile-first, responsive layout
- **Developer-Friendly**
  - TypeScript everywhere (frontend & backend)
  - Modular code structure
  - Reusable components & APIs

## 🛠️ Tech Stack

**Frontend**

- React + TypeScript
- Vite
- React Hook Form + Zod (form validation)
- Tailwind CSS (UI styling)
- Axios (API calls)
- React Router (routing)

**Backend**

- Node.js + Express.js
- MongoDB + Mongoose
- Passport.js (Google OAuth strategy)
- JWT (authentication)
- Nodemailer (OTP delivery)

**Deployment**

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas



## ⚙️ Installation Guide

1. Clone the repository
2. Setup backend and frontend (npm install)
3. Configure environment variables (.env files)
4. Run backend (http://localhost:7000)
5. Run frontend (http://localhost:5173)

## 🌍 Deployment

- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas
- Google OAuth setup (Authorized redirect URIs)

## 📖 API Endpoints

### Auth

- POST /auth/request-otp
- POST /auth/verify-otp
- GET /auth/google
- GET /auth/google/callback

### Notes

- GET /notes
- POST /notes
- PUT /notes/:id
- DELETE /notes/:id

## 🤝 Contribution Guidelines

- Fork repo, branch, commit, PR

## 📜 License

MIT License © 2025 Your Name

