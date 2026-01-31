import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import Students from "./pages/admin/Students";
import Fees from "./pages/admin/Fees";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import AddStudent from "./pages/admin/AddStudent";
import Register from "./pages/auth/Register";
import StudentDetails from "./pages/admin/StudentDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentDetails />} />
        <Route path="students/add" element={<AddStudent />} />
        <Route path="fees" element={<Fees />} />
      </Route>

      <Route path="*" element={<Navigate to="/register" />} />
    </Routes>
  );
}
