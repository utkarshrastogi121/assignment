import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { Star, BookOpen, User, ArrowUpDown, Search } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  averageRating: number;
  publishedYear?: number;
}

interface Props {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

export default function BookList({ books, setBooks }: Props) {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("none");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchBooks = async () => {
      try {
        const res = await API.get(`/books?page=${page}`);
        if (!cancelled) setBooks(res.data.books);
      } catch (err) {
        console.error("Error loading books:", err);
      }
    };
    fetchBooks();
    return () => {
      cancelled = true;
    };
  }, [page, setBooks]);

  const getAvgRating = (book: Book) => book.averageRating ?? 0;

  // Sorting logic
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "ratingDesc":
        return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      case "ratingAsc":
        return (a.averageRating ?? 0) - (b.averageRating ?? 0);
      case "yearDesc":
        return (b.publishedYear ?? 0) - (a.publishedYear ?? 0);
      case "yearAsc":
        return (a.publishedYear ?? 0) - (b.publishedYear ?? 0);
      default:
        return 0;
    }
  });

  // Search logic
  const filteredBooks = sortedBooks.filter((book) => {
    const search = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search)
    );
  });

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-center lg:text-left">
          Books
        </h1>

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-end items-center">
          {/* Search bar */}
          <div className="flex items-center w-full sm:w-auto border border-gray-300 rounded-md px-3 py-1.5 bg-white focus-within:ring-2 focus-within:ring-indigo-500">
            <Search size={16} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm w-full sm:w-56 md:w-64"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown size={18} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="none">Sort By</option>
              <option value="ratingDesc">Rating: High to Low</option>
              <option value="ratingAsc">Rating: Low to High</option>
              <option value="yearDesc">Year: Newest First</option>
              <option value="yearAsc">Year: Oldest First</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <Link
              to="/add-book"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
            >
              <BookOpen size={18} /> Add Book
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-md flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
            >
              <User size={18} /> Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Books list */}
      <ul className="space-y-3">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <li
              key={book._id}
              className="p-4 sm:p-6 shadow-md rounded-lg bg-white hover:shadow-lg transition"
            >
              <Link
                to={`/books/${book._id}`}
                className="font-semibold text-base sm:text-lg hover:underline break-words"
              >
                {book.title} - {book.author}
              </Link>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-gray-700">
                <p className="flex items-center gap-1 text-sm sm:text-base">
                  <Star size={16} color="gold" fill="gold" />
                  {getAvgRating(book).toFixed(1)}
                </p>
                {book.publishedYear && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    ({book.publishedYear})
                  </p>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-6">
            No books found matching your search.
          </p>
        )}
      </ul>

      {/* Pagination */}
      <div className="flex gap-3 mt-8 justify-center flex-wrap">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white shadow-md rounded w-full sm:w-auto cursor-pointer"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white shadow-md rounded w-full sm:w-auto cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
