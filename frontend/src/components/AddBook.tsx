import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { BookOpenText  } from 'lucide-react'

export default function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [publishedYear, setPublishedYear] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await API.post("/books", { title, author, description, genre, publishedYear });
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center flex items-center p-8">
            <span className="flex-1 text-3xl">Add Book</span>
            <BookOpenText  />
        </h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Author"
          className="w-full p-2 border rounded"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Genre"
          className="w-full p-2 border rounded"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Published Year"
          className="w-full p-2 border rounded"
          value={publishedYear}
          onChange={(e) => setPublishedYear(e.target.value)}
        />
        <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer">
          Add Book
        </button>
      </form>
    </div>
  );
}
