# 📚 Book Review App

Welcome to the Book Review App! This web application allows users to discover, review, and manage their favorite books. Built with modern web technologies, it offers a seamless experience for book enthusiasts.

🔗 Live Demo: [https://bookreview-three.vercel.app/](https://bookreview-three.vercel.app/)

---

## 🚀 Features

- **User Authentication**: Secure login and registration system.
- **Book Discovery**: Browse a curated list of books.
- **Review System**: Rate and write reviews for books.
- **Responsive Design**: Optimized for both desktop and mobile devices.

---

## 🛠️ Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Rate-limiter, winston-logger
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 📦 Installation



### Clone the Repository

```bash
git clone https://github.com/utkarshrastogi121/assignment.git
```
### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```
2. Install dependencies:
```bash
npm install
```
3. Create a .env file and add your environment variables:
```bash
MONGO_URI=***
JWT_SECRET=***
JWT_EXPIRES_IN=***
BCRYPT_SALT_ROUNDS=***
RATE_LIMIT_WINDOW_MINUTES=***
RATE_LIMIT_MAX=***
```
4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1.Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Create a .env file and add your backend URL:
``` bash
VITE_BACKEND_URL=https://bookreviewproject.onrender.com
```
4. Run the project:
```bash
npm run dev
```

## ❓ If Any Queries

For any queries or assistance, connect with me at: **utkarshr1201@gmail.com**
