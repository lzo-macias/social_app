import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateCommentComponent() {

    
  return (
        <div>
          <form onSubmit={handleSubmit}>
            <label>
              Comment:
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Comment"}
            </button>
          </form>
        </div>
  )
}

export default CreateCommentComponent