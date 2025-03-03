import { useState } from "react";
import axios from "axios";

function DeleteCommentComponent({ apiEndpoint, commentId, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${apiEndpoint}/${commentId}`);
      alert("Comment deleted successfully!");
      if (onDelete) onDelete();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Comment"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default DeleteCommentComponent;