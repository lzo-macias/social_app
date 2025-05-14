// import React, { useState } from "react";
// import axios from "axios";
// import ImgUploadComponent from "./ImageComponents/ImgUploadComponent";

// const CreatePostComponent = ({
//   endpoint = `${import.meta.env.VITE_API_BASE_URL}/personal-post/post`,
//   onSuccess,
// }) => {
//   const [content, setContent] = useState("");
//   const [imgId, setImgId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showForm, setShowForm] = useState(false);

//   const handleImageUpload = (uploadedImgId) => {
//     console.log("✅ Received imgId:", uploadedImgId);
//     setImgId(uploadedImgId);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("Unauthorized: Please log in.");
//       setLoading(false);
//       return;
//     }

//     if (!imgId) {
//       setError("An image is required to create a post.");
//       setLoading(false);
//       return;
//     }

//     const postData = {
//       content,
//       img_id: imgId,
//     };

//     try {
//       const response = await axios.post(endpoint, postData, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log("✅ Post created:", response.data);
//       if (onSuccess) onSuccess(response.data.newPost);

//       // Reset state
//       setContent("");
//       setImgId(null);
//       setShowForm(false);
//     } catch (err) {
//       console.error("❌ Error creating post:", err);
//       setError("Failed to add post. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <button className="btn" onClick={() => setShowForm(!showForm)}>
//         {showForm ? "Close Post Form" : "Create New Post"}
//       </button>

//       {showForm && (
//         <form onSubmit={handleSubmit}>
//           <h3>Create a New Post</h3>
//           <input
//             type="text"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             placeholder="Write your post..."
//             required
//           />

//           <ImgUploadComponent onImageUpload={handleImageUpload} />

//           <button type="submit" disabled={loading}>
//             {loading ? "Posting..." : "Add New Post"}
//           </button>

//           {error && <p style={{ color: "red" }}>{error}</p>}
//         </form>
//       )}
//     </div>
//   );
// };

// export default CreatePostComponent;


// ✅ CreatePostComponent.jsx
import React, { useState } from "react";
import axios from "axios";
import ImgUploadComponent from "./ImageComponents/ImgUploadComponent";

const CreatePostComponent = ({
  endpoint = `${import.meta.env.VITE_API_BASE_URL}/personal-post/post`,
  onSuccess,
}) => {
  const [content, setContent] = useState("");
  const [imgId, setImgId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleImageUpload = (uploadedImgId) => {
    setImgId(uploadedImgId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized: Please log in.");
      setLoading(false);
      return;
    }

    if (!imgId) {
      setError("An image is required to create a post.");
      setLoading(false);
      return;
    }

    const postData = {
      content,
      img_id: imgId,
    };

    try {
      const response = await axios.post(endpoint, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (onSuccess) onSuccess(response.data.newPost);
      setContent("");
      setImgId(null);
      setShowForm(false);
      window.location.reload()
    } catch (err) {
      setError("Failed to add post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Close Post Form" : "Create New Post"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <h3>Create a New Post</h3>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post..."
            required
          />

          <ImgUploadComponent onImageUpload={handleImageUpload} />

          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Add New Post"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default CreatePostComponent;