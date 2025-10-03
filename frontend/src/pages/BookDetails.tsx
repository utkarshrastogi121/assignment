import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { Star } from "lucide-react";

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
      const { data: updatedBook } = await API.post(`/review/${id}`, {
        bookId: id,
        rating,
        text: comment,
      });
      setRating(0);
      setComment("");
      setBook(updatedBook);

      if (updatedBook.avgRating !== undefined) {
        updateBookRating(updatedBook._id!, updatedBook.avgRating);
      }
    } catch (err: any) {
      alert(err.response?.data.message || "Error submitting review");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const { data: updatedBook } = await API.delete(`/review/${reviewId}`);
      setBook(updatedBook);

      if (updatedBook.avgRating !== undefined) {
        updateBookRating(updatedBook._id!, updatedBook.avgRating);
      }
    } catch (err: any) {
      alert(err.response?.data.message || "Error deleting review");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!book) return <p className="p-6 text-red-600">Book not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold">{book.title || "Untitled Book"}</h1>
      <p className="text-gray-700"> Author: {book.author || "Unknown Author"}</p>
      <p className="mt-2 text-md bg-gray-300 rounded-lg p-3">{book.description || "No description available"}</p>
      <p className="flex items-center gap-1 mt-2">
        <Star size={16} color="gold" fill="gold" />{" "}
        {typeof book.avgRating === "number"
          ? book.avgRating.toFixed(1)
          : "No rating yet"}
      </p>

      <h2 className="mt-6 text-xl font-semibold">Reviews</h2>
      {book.reviews && book.reviews.length > 0 ? (
        <ul className="space-y-2 mt-2">
          {book.reviews.map((r) => {
            const reviewUserId =
              typeof r.user === "string" ? r.user : r.user?._id?.toString() || null;
            const reviewUserName =
              typeof r.user === "string" ? "Anonymous" : r.user?.name || "Anonymous";

            return (
              <li
                key={r._id}
                className="p-5 border-none rounded-lg shadow-lg bg-white flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{reviewUserName}</p>
                  <p className="flex items-center gap-1">
                    <Star size={16} color="gold" fill="gold" /> {r.rating ?? "N/A"}
                  </p>
                  <p>{r.text ?? "No comment"}</p>
                </div>
                {userId && reviewUserId === userId && (
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="ml-4 text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2 text-gray-500">No reviews yet</p>
      )}

      {/* Review Form */}
      <form onSubmit={handleReview} className="mt-6 space-y-2">
        <div className="flex gap-2">
          {Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
            return (
              <Star
                key={starValue}
                size={28}
                className="cursor-pointer transition-colors"
                color={
                  starValue <= (hoverRating || rating) ? "gold" : "gray"
                }
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
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded cursor-pointer"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
