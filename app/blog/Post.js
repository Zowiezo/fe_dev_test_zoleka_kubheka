// Post.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const fetchPost = async (id) => {
  try {
    const response = await axios.get(`https://localhost:3000/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

const fetchComments = async (id) => {
  try {
    const response = await axios.get(
      `https://localhost:3000/api/posts/${id}/comments`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

const addComment = async (id, commentData) => {
  try {
    const response = await axios.post(
      `https://localhost:3000/api/posts/${id}/comments`,
      commentData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
};

const Post = () => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", body: "" });
  const { id } = useRouter().query;

  useEffect(() => {
    if (id) {
      const fetchPostAndComments = async () => {
        const fetchedPost = await fetchPost(id);
        const fetchedComments = await fetchComments(id);
        setPost(fetchedPost);
        setComments(fetchedComments);
        setLoading(false);
      };

      fetchPostAndComments();
    }
  }, [id]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newComment = await addComment(id, formData);
    if (newComment) {
      setComments([...comments, newComment]);
      setFormData({ name: "", email: "", body: "" });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <p>By: {post.authorId}</p>

      <h2>Add Comment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Comment:</label>
          <textarea name="body" value={formData.body} onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>

      <h2>Comments</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment.profileId}>
              <p>{comment.name}</p>
              <p>{comment.email}</p>
              <p>{comment.body}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments</p>
      )}
    </div>
  );
};

export default Post;
