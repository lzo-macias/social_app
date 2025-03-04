import { useState } from "react";
import axios from "axios";

function EditCommentComponent({ apiEndpoint, commentId, initialText, onUpdate }) {
  const [comment, setComment] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`${apiEndpoint}/${commentId}`, { comment });
      alert("Comment updated successfully!");
      if (onUpdate) onUpdate();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
      <form onSubmit={handleUpdate}>
        <textarea
          className="w-full p-2 border rounded"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Comment"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default EditCommentComponent;