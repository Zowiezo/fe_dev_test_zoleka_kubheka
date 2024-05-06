import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const fetchPost = async (id) => {
  try {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
};

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchPostAndSetState = async () => {
        const post = await fetchPost(id);
        setPost(post);
      };

      fetchPostAndSetState();
    }
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <p>By: {post.id}</p>
    </div>
  );
};

export default Post;
// use given api route to fetch the post once done testing
