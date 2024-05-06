"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setPosts((prevPosts) =>
      prevPosts.map((post) => ({
        ...post,
        isFavorite: storedFavorites.includes(post.id),
      }))
    );
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts");
        const data = response.data;
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.title.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [filterText, posts]);

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const toggleFavorite = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isFavorite = !post.isFavorite;
          const updatedPosts = isFavorite
            ? [...prevPosts, postId]
            : prevPosts.filter((id) => id !== postId);
          localStorage.setItem("favorites", JSON.stringify(updatedPosts));
          return { ...post, isFavorite };
        }
        return post;
      })
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Filter by title..."
        value={filterText}
        onChange={handleFilterChange}
      />
      <div class="max-w-sm rounded overflow-hidden shadow-lg">
        {filteredPosts.map((post) => (
          <div key={post.id} class="px-6 py-4">
            <Link href={`localhost:3000/api/post/${post.id}`}>
              <id class="font-bold text-xl mb-4">{post.title}</id>
            </Link>{" "}
            <p class="text-gray-900 leading-none">By: {post.authorId}</p>
            <button onClick={() => toggleFavorite(post.id)}>
              {post.isFavorite ? "Unfavorite" : "Favorite"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
