import React, { useState } from "react";
import axios from "axios";

function CreateCommentComponent() {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/`, { text: comment });
      setComment("");
      alert("Comment submitted successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit comment");
    } finally {
      setLoading(false);
    }
  };

    
  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Write your comment here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button
        type="submit"
        className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Comment"}
      </button>
    </form>
    {error && <p className="text-red-500 mt-2">{error}</p>}
  </div>
);
}

export default CreateCommentComponent