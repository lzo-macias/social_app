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
      const token = localStorage.getItem("token");
    const url = `${apiEndpoint}/${commentId}`;
    console.log("Updating comment at:", url);
    console.log("Payload:", { comment });
    
    // Capture the response
    const { data: updatedComment } = await axios.put(
      url,
      { comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log("Update response:", updatedComment);
    alert("Comment updated successfully!");
    
    // Pass the updated comment back to the parent component
    if (onUpdate) onUpdate(updatedComment);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update comment");
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