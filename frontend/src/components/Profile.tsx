import React, { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import { BookOpen, Star, User, Pencil, Trash2, X } from "lucide-react";

interface User {
  name: string;
  email: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  genre?: string;
  publishedYear?: string;
  createdAt: string;
}

interface Review {
  _id: string;
  rating: number;
  text: string;
  createdAt: string;
  book?: { _id: string; title: string; author: string };
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    publishedYear: "",
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/profile");
      setUser(res.data.user);
      setBooks(res.data.books);
      setReviews(res.data.reviews);
    } catch (err) {
      console.error("Error loading profile", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await API.delete(`/books/${bookId}`);
      await fetchProfile();
    } catch (err) {
      console.error("Failed to delete book", err);
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      description: book.description,
      genre: book.genre || "",
      publishedYear: book.publishedYear || "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    if (!editingBook) return;
    try {
      await API.put(`/books/${editingBook._id}`, editForm);
      setEditingBook(null);
      await fetchProfile();
    } catch (err) {
      console.error("Failed to update book", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="animate-pulse text-lg text-gray-600">
          Loading profile...
        </p>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold">User not found</p>
      </div>
    );

  return (
    <div className="max-w-full mx-auto p-8 shadow-xl rounded-2xl">
      {/* user information */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <User className="w-8 h-8 text-green-700" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* Books */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-800">
          <BookOpen className="w-5 h-5 text-green-600" /> My Books
        </h3>
        {books.length === 0 ? (
          <p className="text-gray-500 italic">
            You haven't added any books yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {books.map((book) => (
              <div
                key={book._id}
                className="p-4 border-none shadow-lg rounded-xl bg-white hover:shadow-lg transition relative"
              >
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleEditBook(book)}
                    className="text-blue-500 hover:text-blue-800 cursor-pointer"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="font-bold text-lg">{book.title}</p>
                <p className="text-sm text-gray-600">
                  by {book.author} {book.genre && `• ${book.genre}`}{" "}
                  {book.publishedYear && `• ${book.publishedYear}`}
                </p>
                <p className="mt-2 text-gray-700">{book.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Added on {new Date(book.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-800">
          <Star className="w-5 h-5 text-yellow-500" /> My Reviews
        </h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">
            You haven't written any reviews yet.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-4 border-none shadow-lg rounded-xl bg-white hover:shadow-lg transition relative"
              >
                <p className="font-semibold text-lg">
                  {rev.book?.title}{" "}
                  <span className="text-yellow-500 ml-2">
                    {"★".repeat(rev.rating)}
                  </span>
                </p>
                <p className="text-gray-700 mt-1">{rev.text}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* edit modal */}
      {editingBook && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="absolute inset-0  bg-white/60"></div>

          <div className="relative bg-white border border-gray-300 p-6 rounded-2xl w-full max-w-md z-10">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setEditingBook(null)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
            <div className="space-y-3">
              <input
                name="title"
                value={editForm.title}
                onChange={handleChange}
                placeholder="Title"
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                name="author"
                value={editForm.author}
                onChange={handleChange}
                placeholder="Author"
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                name="genre"
                value={editForm.genre}
                onChange={handleChange}
                placeholder="Genre"
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                name="publishedYear"
                value={editForm.publishedYear}
                onChange={handleChange}
                placeholder="Published Year"
                className="w-full border px-3 py-2 rounded-md"
              />
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
            <button
              onClick={handleSaveEdit}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
