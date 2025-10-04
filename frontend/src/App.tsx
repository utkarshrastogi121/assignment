import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import BookList from "./components/BookList";
import BookDetails from "./components/BookDetails";
import AddBook from "./components/AddBook";
import Profile from "./components/Profile";
import ProtectedRoute from "./utils/ProtectedRoute";

interface Book {
  _id: string;
  title: string;
  author: string;
  averageRating: number;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);

  const updateBookRating = (bookId: string, averageRating: number) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => (b._id === bookId ? { ...b, averageRating } : b))
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BookList books={books} setBooks={setBooks} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetails updateBookRating={updateBookRating} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-book"
          element={
            <ProtectedRoute>
              <AddBook />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
