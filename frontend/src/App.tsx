import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookList from "./pages/BookList";
import BookDetails from "./pages/BookDetails";
import AddBook from "./pages/AddBook";
import ProtectedRoute from "./components/ProtectedRoute";

interface Book {
  _id: string;
  title: string;
  author: string;
  avgRating: number;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);

  // Function to update a book's rating
  const updateBookRating = (bookId: string, avgRating: number) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => (b._id === bookId ? { ...b, avgRating } : b))
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
