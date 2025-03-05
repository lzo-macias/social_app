// EditCommentComponent.jsx
import { useState } from "react";
import axios from "axios";

function EditCommentComponent({
  apiEndpoint,
  commentId,
  initialText,
  onUpdate,
}) {
  const [comment, setComment] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const url = `${apiEndpoint}/${commentId}`;
      const { data: updatedComment } = await axios.put(
        url,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Comment updated successfully!");
      if (onUpdate) onUpdate(updatedComment);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleUpdate}>
        <textarea
          className="w-full p-2 border rounded"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Comment"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default EditCommentComponent;
