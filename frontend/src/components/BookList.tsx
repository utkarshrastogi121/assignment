import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { Star, BookOpen, User } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  avgRating: number;
}

interface Props {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

export default function BookList({ books, setBooks }: Props) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const res = await API.get(`/books?page=${page}`);
        if (!cancelled) setBooks(res.data.books);
      } catch (err) {
        console.error("Error loading books", err);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
  }, [page, setBooks]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Books</h1>

        <div className="flex gap-3">
          <Link
            to="/add-book"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer shadow-md flex items-center gap-2"
          >
            <BookOpen size={18} /> Add Book
          </Link>

          <Link
            to="/profile"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded cursor-pointer shadow-md flex items-center gap-2"
          >
            <User size={18} /> Profile
          </Link>
        </div>
      </div>

      {/* Book List */}
      <ul className="space-y-3">
        {books.map((book) => (
          <li
            key={book._id}
            className="p-6 shadow-md rounded-lg bg-white hover:shadow-lg transition"
          >
            <Link
              to={`/books/${book._id}`}
              className="font-semibold text-lg hover:underline"
            >
              {book.title} - {book.author}
            </Link>
            <p className="flex items-center gap-1 mt-2 text-gray-700">
              <Star size={16} color="gold" fill="gold" />{" "}
              {book.avgRating?.toFixed(1) ?? "0.0"}
            </p>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex gap-3 mt-6 justify-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white shadow-md rounded cursor-pointer"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white shadow-md rounded cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
