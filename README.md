
# 📝 Note-App

🚀 Note-App is a full-stack web application that allows users to securely create, manage, and organize their notes.
Built with a Node.js + Express + MongoDB backend and a React + TypeScript frontend, it provides a modern and responsive user experience. The app features user authentication (JWT & OAuth), CRUD functionality for notes, and email integration via Nodemailer.

Designed with scalability and maintainability in mind, this project follows a clean architecture and leverages TypeScript for type safety on both client and server sides.

✨ Key Highlights

🔐 Secure authentication system

📝 Full CRUD operations for notes

📧 Email support (password recovery/notifications)

⚡ High-performance frontend with Vite

🎨 Responsive UI with reusable React components


## ✨ Features
- 🔐 Secure User Authentication (JWT + OAuth redirect)  
- 🗒️ Notes CRUD functionality  
- 💾 MongoDB Database Integration  
- 🛡️ Middleware-protected routes  
- 📧 Email notifications with Nodemailer  
- 🎨 Responsive React UI with Vite  

## Authors

- [@YahyaShanawazMohammed](https://github.com/Shaan-77)


## Demo

Project-Demo : https://note-app-assignment-mern-1.onrender.com/

---

## 🚀 Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication & Oauth(google Authentication)
- SendGrid

### Frontend
- React.js (with TypeScript)
- Vite (Build tool)
- Axios (API handling)
- TailwindCSS

---

## Screenshots

### AUTH-SignUP-Page
<img width="1891" height="833" alt="Screenshot (127)" src="https://github.com/user-attachments/assets/dde16d9b-1157-47f5-bf3e-aa19ccc408b4" />

### AUTH-SignIn-Page
<img width="1909" height="830" alt="Screenshot (128)" src="https://github.com/user-attachments/assets/3bb2c27b-02d0-48d9-8f37-c2b70f8efdbe" />

### Dashboard_Page
<img width="1894" height="852" alt="Screenshot (129)" src="https://github.com/user-attachments/assets/5e79aaa7-fed0-4578-81f0-146a42a4c921" />


---
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URI` = //Your mongo URI

`PORT`=

`SENDGRID_API_KEY` = // Your sendgrid_API_KEY

`SMTP_FROM` = /Your smtp from mail address

`GOOGLE_CLIENT_ID` =// your GOOGLE_CLIENT_ID

`GOOGLE_CLIENT_SECRET` = //Your
GOOGLE_CLIENT_SECRET

`BACKEND_ROOT` = //Backend_URL

`FRONTEND_ROOT`= //Frontend_URL

---

## Run Locally

Clone the project

```bash
  git clone https://github.com/Shaan-77/Note-App_Assignment-MERN
```

Go to the Backend directory

```bash
  cd Backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

Go to the Frontend directory

```bash
  cd Frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

---
## Deployment

### Backend Setup

```bash
cd Note-App/Backend
```
#### Install dependencies

```bash
npm install
```
### Build dependencies       
```bash
npm run build 
```    
#### Deployment

```bash
npm run start
```    
### Frontend Setup

```bash
cd Note-App/Frontend
```
#### Install dependencies

```bash
npm install
```
### Build dependencies       
```bash
npm run build 
```
---

   ## 📜 License
This project is created for internship and educational purposes.

