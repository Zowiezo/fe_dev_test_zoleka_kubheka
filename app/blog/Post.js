import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const fetchPost = async (id) => {
  try {
    const response = await axios.get(`/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

const fetchComments = async (id) => {
  try {
    const response = await axios.get(`/api/posts/${id}/comments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

const fetchUserProfile = async (profileId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/api/profiles/${profileId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

const addComment = async (id, comment) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/api/posts/${id}/comments`,
      {
        body: comment,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
};

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPost = await fetchPost(id);
      setPost(fetchedPost);
      if (fetchedPost) {
        const fetchedComments = await fetchComments(id);
        setComments(fetchedComments);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    const addedComment = await addComment(id, newComment);
    if (addedComment) {
      setComments([...comments, addedComment]);
      setNewComment("");
    }
  };

  const fetchAndSetUserProfile = async (comment) => {
    const userProfile = await fetchUserProfile(comment.profileId);
    return userProfile ? { ...comment, userProfile } : comment;
  };

  useEffect(() => {
    const fetchUserProfileForComments = async () => {
      const commentsWithUserProfiles = await Promise.all(
        comments.map(fetchAndSetUserProfile)
      );
      setComments(commentsWithUserProfiles);
    };

    if (comments.length > 0) {
      fetchUserProfileForComments();
    }
  }, [comments]);

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.body}</p>
            {comment.userProfile && (
              <p>
                By: {comment.userProfile.firstName}{" "}
                {comment.userProfile.lastName}
              </p>
            )}
          </li>
        ))}
      </ul>
      <textarea
        value={newComment}
        onChange={handleCommentChange}
        placeholder="Add a comment..."
      />
      <button onClick={handleSubmitComment}>Submit</button>
    </div>
  );
};

export default Post;
