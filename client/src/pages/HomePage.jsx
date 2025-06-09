
//chnage
import { useEffect, useState } from "react";
import axios, { createComment, getCommentsByPost } from "../services/api";

function HomePage() {
  const [user, setUser] = useState(null);
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);

  //post
  const [editPostId, setEditPostId] = useState(null);
  const [editText, setEditText] = useState("");
  const [postError, setPostError] = useState("");
  const [editError, setEditError] = useState("");

  //comment
    const [commentInputs, setCommentInputs] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
const [editingCommentText, setEditingCommentText] = useState("");
const [commentErrors, setCommentErrors] = useState({});



  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/posts");
      setPosts(res.data);

        // Fetch comments for all posts
      for (const post of res.data) {
        fetchComments(post.post_id);
      }


    } catch (err) {
      console.error("Error fetching posts", err);
    }
  };

//
    const fetchComments = async (postId) => {
    try {
      const res = await getCommentsByPost(postId);
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: res.data,
      }));
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };



const handlePost = async () => {
  //if (!postText.trim()) return;
    setPostError(""); // Clear previous errors

  if (!postText.trim()) {
    setPostError("Post content cannot be empty.");
    return;
  }

  if (postText.length < 5) {
    setPostError("Post must be at least 5 characters.");
    return;
  }

  if (postText.length > 280) {
    setPostError("Post cannot exceed 280 characters.");
    return;
  }
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.USER_ID) {
      console.error("User ID missing");
      return;
    }
    JSON.parse(localStorage.getItem("user"))
    const postData = {
      post_user_id: storedUser.USER_ID,
      post_content: postText,
    };

    const response = await axios.post("/posts", postData);
    setPosts(prevPosts => [response.data, ...prevPosts]);
    setPostText("");
  } catch (error) {
    console.error("Failed to create post", error);
  }
};

const handleAddComment = async (postId) => {
  const text = commentInputs[postId]?.trim();
  setCommentErrors((prev) => ({ ...prev, [postId]: "" })); // Clear previous error

  if (!text) {
    setCommentErrors((prev) => ({ ...prev, [postId]: "Comment cannot be empty." }));
    return;
  }

  if (text.length < 2) {
    setCommentErrors((prev) => ({ ...prev, [postId]: "Comment must be at least 2 characters." }));
    return;
  }

  if (text.length > 200) {
    setCommentErrors((prev) => ({ ...prev, [postId]: "Comment cannot exceed 200 characters." }));
    return;
  }

  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || !storedUser.USER_ID) {
      console.error("User ID missing");
      return;
    }

    const commentData = {
      comment_post_id: postId,
      comment_user_id: storedUser.USER_ID,
      comment_text: text,
    };

    const response = await axios.post("/comments", commentData); // Adjust URL if needed

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    setCommentErrors((prev) => ({ ...prev, [postId]: "" }));
    fetchComments(postId);
  } catch (error) {
    console.error("Failed to add comment", error);
    setCommentErrors((prev) => ({
      ...prev,
      [postId]: error.response?.data?.error || "Something went wrong.",
    }));
  }
};




//post

  const handleEdit = (post) => {
    setEditPostId(post.post_id);
    setEditText(post.post_content);
  };

  const handleUpdate = async (id) => {
     setEditError(""); // Clear previous error

  if (!editText.trim()) {
    setEditError("Post content cannot be empty.");
    return;
  }
  if (editText.length < 5) {
    setEditError("Post must be at least 5 characters.");
    return;
  }
  if (editText.length > 280) {
    setEditError("Post cannot exceed 280 characters.");
    return;
  }
    try {
      const res = await axios.put(`/posts/${id}`, { post_content: editText });
      setPosts(posts.map(post => post.post_id === id ? res.data : post));
      setEditPostId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating post", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/posts/${id}`);
      setPosts(posts.filter(post => post.post_id !== id)); // remove from UI
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  //comment update , delete
  const handleEditComment = (comment) => {
  setEditingCommentId(comment.comment_id);
  setEditingCommentText(comment.comment_text);
};

// const handleUpdateComment = async (commentId, postId) => {
//   try {
//     await axios.put(`/comments/${commentId}`, { comment_text: editingCommentText });
//     setEditingCommentId(null);
//     setEditingCommentText("");
//     fetchComments(postId);
//   } catch (error) {
//     console.error("Error updating comment", error);
//   }
// };
const handleUpdateComment = async (commentId, postId) => {
  const text = editingCommentText.trim();
  let error = "";

  if (!text) {
    error = "Comment cannot be empty.";
  } else if (text.length < 2) {
    error = "Comment must be at least 2 characters.";
  } else if (text.length > 200) {
    error = "Comment cannot exceed 200 characters.";
  }

  if (error) {
    setCommentErrors((prev) => ({ ...prev, [postId]: error }));
    return;
  }

  try {
    await axios.put(`/comments/${commentId}`, { comment_text: text });
    setEditingCommentId(null);
    setEditingCommentText("");
    setCommentErrors((prev) => ({ ...prev, [postId]: "" })); // Clear error
    fetchComments(postId);
  } catch (error) {
    console.error("Error updating comment", error);
  }
};


const handleDeleteComment = async (commentId, postId) => {
  try {
    await axios.delete(`/comments/${commentId}`);
    fetchComments(postId);
  } catch (error) {
    console.error("Error deleting comment", error);
  }
};
const handleLogout = () => {
  localStorage.removeItem("user"); // Clear localStorage
  window.location.href = "/login"; // Redirect to login page (adjust path if needed)
};

  return (

<div className="bg-gray-900 min-h-screen text-gray-100 font-sans py-8 px-4">
  <div className="max-w-2xl mx-auto"> {/* fixed width container */}
    <h1 className="text-3xl font-extrabold mb-6">Welcome, {user?.USER_NAME}</h1>

<div className="fixed top-4 right-4">
  <button
    onClick={handleLogout}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold"
  >
    Logout
  </button>
</div>


    <textarea
      value={postText}
      onChange={(e) => setPostText(e.target.value)}
      placeholder="What's on your mind?"
      className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 mb-4 text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows={4}
    />
    

    <button
      type="button"
      onClick={handlePost}
      className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-md font-semibold mb-8"
    >
      Post
    </button>
    {postError && <p className="text-red-500 text-sm mb-2">{postError}</p>}

    


    <div>
      <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">Recent Posts</h2>

      {posts.map((post) => (
        <div
          key={post.post_id}
          className="relative bg-gray-800 rounded-lg shadow-md p-5 mb-6 border border-gray-700 max-w-2xl mx-auto"
        >
          {/* Edit/Delete icons top-right */}
          {user?.USER_ID === post.post_user_id && (
            <div className="absolute top-3 right-3 flex space-x-3">
              <button
                onClick={() => handleEdit(post)}
                aria-label="Edit post"
                className="text-blue-400 hover:text-blue-600"
                title="Edit post"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(post.post_id)}
                aria-label="Delete post"
                className="text-red-500 hover:text-red-700"
                title="Delete post"
              >
                🗑️
              </button>
            </div>
          )}

          {editPostId === post.post_id ? (
           <>
    <textarea
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
      className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 mb-1 text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
      rows={3}
    />
    {editError && <p className="text-red-500 text-sm mb-2">{editError}</p>}
    <div className="flex space-x-3">
      <button
        onClick={() => handleUpdate(post.post_id)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md font-medium"
      >
        Save
      </button>
      <button
        onClick={() => {
          setEditPostId(null);
          setEditError("");
        }}
        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded-md font-medium"
      >
        Cancel
      </button>
    </div>
  </>
          ) : (
            <>
              <p className="text-gray-300 mb-1 whitespace-pre-wrap">{post.post_content}</p>
              <p className="text-xs text-gray-500 mb-3">
                {/* Posted by User ID: {post.post_user_id} */}
                Posted by: {post.author?.USER_NAME || `User ID: ${post.post_user_id}`}
              </p>
              
            </>
          )}

          {/* Comments Section */}
          <div className="mt-4"> {/* removed pl-4 to align */}
            {commentsByPost[post.post_id]?.length > 0 ? (
              commentsByPost[post.post_id].map((comment) => (
                <div
                  key={comment.comment_id}
                  className="relative bg-gray-700 rounded-md p-3 mb-3 shadow-sm max-w-xl mx-auto"
                  
                >
                  {/* <strong>{comment.username}:</strong> {comment.comment_text} */}
                  {editingCommentId === comment.comment_id ? (
                    <>
                      <input
                        type="text"
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <div className="flex space-x-3 mt-2">
                        <button
                          onClick={() => handleUpdateComment(comment.comment_id, post.post_id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingCommentId(null)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                     <p className="text-sm text-gray-400 font-semibold mb-1">
                   👤 {comment.commenter?.USER_NAME || `User ID: ${comment.comment_user_id}`}
                       </p>
                       <p className="text-gray-300 mb-1">💬 {comment.comment_text}</p>
             
                      {user?.USER_ID === comment.comment_user_id && (
                        <div className="absolute top-2 right-3 flex space-x-3 text-sm">
                          <button
                            onClick={() => handleEditComment(comment)}
                            className="text-blue-400 hover:text-blue-600"
                            aria-label="Edit comment"
                            title="Edit comment"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.comment_id, post.post_id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Delete comment"
                            title="Delete comment"
                          >
                            🗑️
                          </button>
 

                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No comments yet</p>
            )}

      
            {/* Add new comment */}
            <div className="mt-4 flex space-x-2">
              
           

              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInputs[post.post_id] || ""}
                onChange={(e) =>
                  setCommentInputs((prev) => ({
                    ...prev,
                    [post.post_id]: e.target.value,
                  }))
                }
                className="flex-1 bg-gray-800 border border-gray-600 rounded-md p-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* {commentErrors[post.post_id] && (
               <p className="text-red-500 text-sm mt-1">{commentErrors[post.post_id]}</p>
                )} */}
              <button
                onClick={() => handleAddComment(post.post_id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold"
              >
                Comment
              </button>
            </div>
              {/* Show validation error if exists */}
  {commentErrors[post.post_id] && (
    <p className="text-red-400 text-sm pl-1">{commentErrors[post.post_id]}</p>
  )}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
}

export default HomePage;


