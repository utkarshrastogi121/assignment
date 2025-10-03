import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { Star } from "lucide-react";

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
    // Only fetch from API if books are empty for this page
    if (books.length === 0) {
      API.get(`/books?page=${page}`).then((res) => setBooks(res.data.books));
    }
  }, [page, books.length, setBooks]);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-4xl">Books</h1>
        <Link
          to="/add-book"
          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer"
        >
          Add Book
        </Link>
      </div>

      <ul className="space-y-2">
        {books.map((book) => (
          <li key={book._id} className="p-8 border-none shadow-lg rounded bg-white">
            <Link to={`/books/${book._id}`} className="font-semibold">
              {book.title} - {book.author}
            </Link>
            <p className="flex items-center gap-1">
              <Star size={16} color="gold" fill="gold" />{" "}
              {book.avgRating?.toFixed(1) ?? "0.0"}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-3 py-1 border-none bg-blue-600 hover:bg-blue-900 text-white shadow-md rounded cursor-pointer"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border-none bg-blue-600 hover:bg-blue-900 text-white shadow-md rounded cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
