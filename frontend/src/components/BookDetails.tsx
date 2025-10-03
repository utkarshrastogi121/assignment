import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import {
  Star,
  User,
  BookOpen,
  Calendar,
  MessageSquare,
  PencilLine,
  Trash2,
  Edit2,
} from "lucide-react";

interface ReviewUser {
  _id: string;
  name?: string;
}

interface Review {
  _id: string;
  user?: string | ReviewUser | null;
  rating?: number;
  text?: string;
}

interface Book {
  _id: string;
  title?: string;
  author?: string;
  description?: string;
  genre?: string;
  publishedYear?: number;
  avgRating?: number;
  reviews?: Review[];
}

interface Props {
  updateBookRating: (bookId: string, avgRating: number) => void;
}

export default function BookDetails({ updateBookRating }: Props) {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  const userId = localStorage.getItem("userId");

  const fetchBook = async () => {
    try {
      const { data } = await API.get(`/books/${id}`);
      setBook(data);
      if (data.avgRating !== undefined) {
        updateBookRating(data._id!, data.avgRating);
      }
    } catch (err) {
      console.error("Error fetching book:", err);
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      alert("Please write a review.");
      return;
    }

    try {
      await API.post(`/review/${id}`, {
        bookId: id,
        rating,
        text: comment,
      });

      setRating(0);
      setComment("");
      await fetchBook();
    } catch (err: any) {
      alert(err.response?.data.message || "Error submitting review");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await API.delete(`/review/${reviewId}`);
      await fetchBook();
    } catch (err: any) {
      alert(err.response?.data.message || "Error deleting review");
    }
  };

  const handleEditInit = (review: Review) => {
    setEditingReviewId(review._id!);
    setEditComment(review.text || "");
    setEditRating(review.rating || 0);
  };

  const handleEditSubmit = async (reviewId: string) => {
    if (editRating === 0) {
      alert("Please select a rating.");
      return;
    }
    if (!editComment.trim()) {
      alert("Please write a review.");
      return;
    }

    try {
      await API.put(`/review/${reviewId}`, {
        rating: editRating,
        text: editComment,
      });
      setEditingReviewId(null);
      setEditComment("");
      setEditRating(0);
      await fetchBook();
    } catch (err: any) {
      alert(err.response?.data.message || "Error updating review");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!book) return <p className="p-6 text-red-600">Book not found</p>;

  return (
    <div className="p-6 max-w-full mx-auto space-y-10">
      {/* Book Info */}
      <div className="bg-gradient-to-r from-blue-300 to-purple-400 border border-gray-200 rounded-xl shadow-sm p-6 space-y-3">
        <h1 className="text-3xl font-bold text-gray-900">{book.title || "Untitled Book"}</h1>
        <p className="flex items-center gap-2 text-gray-700">
          <User size={18} className="text-indigo-500" /> 
          <span className="font-medium">{book.author || "Unknown Author"}</span>
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <BookOpen size={18} className="text-indigo-500" /> 
          <span className="font-medium">{book.genre || "Not specified"}</span>
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          <Calendar size={18} className="text-indigo-500" /> 
          <span className="font-medium">{book.publishedYear || "Unknown"}</span>
        </p>
        <p className="mt-2 text-gray-600 leading-relaxed">{book.description || "No description available"}</p>
        <p className="flex items-center gap-2 mt-2 text-lg font-medium text-yellow-600">
          <Star size={20} fill="gold" className="text-yellow-500" />{" "}
          {typeof book.avgRating === "number" ? book.avgRating.toFixed(1) : "No rating yet"}
        </p>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
          <MessageSquare size={22} /> Reviews
        </h2>
        {book.reviews && book.reviews.length > 0 ? (
          <ul className="space-y-3">
            {book.reviews.map((r) => {
              const reviewUserId = typeof r.user === "string" ? r.user : r.user?._id?.toString() || null;
              const reviewUserName = typeof r.user === "string" ? "Anonymous" : r.user?.name || "Anonymous";

              const isEditing = editingReviewId === r._id;

              return (
                <li
                  key={r._id}
                  className="p-4 rounded-lg shadow-lg border-none bg-white flex flex-col hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start w-full">
                    {!isEditing ? (
                      <div className="space-y-1">
                        <p className="font-medium text-indigo-600">{reviewUserName}</p>
                        <p className="flex items-center gap-1 text-yellow-500">
                          <Star size={16} fill="gold" /> {r.rating ?? "N/A"}
                        </p>
                        <p className="text-gray-700 italic">“{r.text ?? "No comment"}”</p>
                      </div>
                    ) : (
                      <div className="space-y-2 flex-1">
                        <div className="flex gap-2">
                          {Array.from({ length: 5 }, (_, i) => {
                            const starValue = i + 1;
                            return (
                              <Star
                                key={starValue}
                                size={24}
                                className="cursor-pointer transition-transform hover:scale-110"
                                color={starValue <= (editHoverRating || editRating) ? "gold" : "gray"}
                                fill={starValue <= (editHoverRating || editRating) ? "gold" : "none"}
                                onMouseEnter={() => setEditHoverRating(starValue)}
                                onMouseLeave={() => setEditHoverRating(0)}
                                onClick={() => setEditRating(starValue)}
                              />
                            );
                          })}
                        </div>
                        <textarea
                          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                          rows={3}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                        />
                      </div>
                    )}

                    {userId && reviewUserId === userId && (
                      <div className="flex gap-2 ml-4">
                        {!isEditing ? (
                          <>
                            <button
                              onClick={() => handleEditInit(r)}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 size={16} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(r._id)}
                              className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditSubmit(r._id!)}
                              className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1 cursor-pointer"
                            >
                              <PencilLine size={16} /> Save
                            </button>
                            <button
                              onClick={() => setEditingReviewId(null)}
                              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No reviews yet. Be the first one!</p>
        )}
      </div>

      {/* Add New Review */}
      <form onSubmit={handleReview} className="bg-white shadow-lg border-none rounded-lg p-6 space-y-4">
        <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
          <PencilLine size={20} /> Write a Review
        </h3>
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
            return (
              <Star
                key={starValue}
                size={32}
                className="cursor-pointer transition-transform hover:scale-110"
                color={starValue <= (hoverRating || rating) ? "gold" : "gray"}
                fill={starValue <= (hoverRating || rating) ? "gold" : "none"}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(starValue)}
              />
            );
          })}
        </div>
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          rows={4}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-800 text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
