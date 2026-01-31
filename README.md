# Student Fee Management System (Assignment)

A full-stack **Student Fee Management System** built using the **PERN stack**.  
---

## Live Features

###  Admin Panel
- Secure admin authentication using **JWT**
- Dashboard with total students overview
- Student management (Add & View Students)
- Monthly fee generation

###  Student Management
- Add students with:
  - Name
  - Class
  - Roll Number
- View all registered students

###  Fee Management
- Generate monthly fees by selecting month & year
- Auto-calculate total fee amount
- Summary showing:
  - Month
  - Total fee amount

###  Security
- **JWT-based authentication**
- **Rate Limiter** to prevent spam
- Protected admin routes

---

## 🛠 Tech Stack

### Frontend
- **React** (with **Vite**)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- React Router

### Backend
- **Node.js**
- **Express.js**
- **JWT Authentication**
- **Rate Limiting Middleware**

### Database
- **PostgreSQL**
- Hosted on **Aiven Cloud**

---

##  Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/utkarshrastogi121/assignment.git
cd assignment
```
### 2. Backend Setup
```bash
cd backend
npm install
```
Create a .env file:
```env
PORT=5000
DATABASE_URL=your_aiven_postgres_url
JWT_SECRET=your_jwt_secret
```
Run backend:
```bash
npm run dev
```
### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a .env file:
```env
VITE_API_BASE_URL= https://mysittu.onrender.com/api
```
Run frontend:
```bash
npm run dev
```

---

##  Future Improvements
1. Student login & fee receipt view
2. Payment gateway integration
3. Export fee reports (PDF / Excel)

---

##  Approach

Designed the application using the PERN stack. The backend handles jwt authentication, rate limiting, and fee generation logic, while the frontend shows admin dashboard. PostgreSQL on Aiven is used for data storage.


