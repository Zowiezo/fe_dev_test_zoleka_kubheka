"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = response.data;
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handleFilterChange = (e) => {
    const text = e.target.value.toLowerCase();
    setFilterText(text);
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(text)
    );
    setFilteredPosts(filtered);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Filter by title..."
        value={filterText}
        onChange={handleFilterChange}
      />
      <ul>
        {filteredPosts.map((post) => (
          <li key={post.id}>
            {post.title} - {post.body}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
