# Student Management System using MERN Stack

This is a full-stack Student Management System built with the MERN stack (MongoDB, Express.js, React.js, and Node.js). The application allows users to **create**, **read**, **update**, and **delete (CRUD)** student records. Each record contains the student's **Name, Registration Number, Phone Number, Age, and Department**.

## 🚀 Features

- Add new student records
- View all students in a clean table layout
- Edit existing student information
- Delete student records
- Responsive and clean UI using React

## 📌 Tech Stack

- **Frontend**: React.js, Axios, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Environment**: `.env` file used in backend for secure config

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Yadhavaramanan/Student-Management-System-using-MERN-Stack.git
cd Student-Management-System-using-MERN-Stack
```

### 2.Setup Backend
```
cd backend
npm install
```
Create a .env file inside the backend folder:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
```

Then start the backend:
```
npm start 
```

### 3. Setup Frontend
In a terminal:
```
cd frontend
npm install
npm start
```
---

## 📂 Folder Structure

```
Student-Management-System/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   └── App.js
│
└── README.md
```
---
## 🤝 Author

Yadhavaramanan C
GitHub: @Yadhavaramanan

---
## 📄 License

This is a personal project for learning and understanding the CRUD Operations.

---

