// DeleteCommentComponent.jsx
import { useState } from "react";
import axios from "axios";

function DeleteCommentComponent({ apiEndpoint, commentId, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiEndpoint}/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Comment deleted successfully!");
      if (onDelete) onDelete(commentId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2">
      <button className="btn" onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete Comment"}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default DeleteCommentComponent;
