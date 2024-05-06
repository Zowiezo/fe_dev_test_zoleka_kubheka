"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  // Initialize state and fetch posts in a useEffect hook
  const [posts, setPosts] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );
        const data = await response.json();
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Use a single state variable for filtered posts
  const handleFilterChange = (e) => {
    const text = e.target.value.toLowerCase();
    setFilterText(text);
    const filtered = posts.filter((post) => {
      // Check if post.title and post.author are not undefined before accessing them
      const title = post.title ? post.title.toLowerCase() : "";
      const author = post.author ? post.author.toLowerCase() : "";
      return title.includes(text) || author.includes(text);
    });
    setFilteredPosts(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Posts</h1>
      <input
        type="text"
        placeholder="Filter posts by title or author"
        className="border border-gray-300 rounded p-2 mb-4"
        value={filterText}
        onChange={handleFilterChange}
      />
      {filteredPosts.map((post) => (
        <div key={post.id} className="border border-gray-300 rounded p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-700">By: {post.author}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
