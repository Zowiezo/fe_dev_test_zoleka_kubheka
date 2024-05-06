"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

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

  const handleFilterChange = (event) => {
    const text = event.target.value.toLowerCase();
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
      <div class="max-w-sm rounded overflow-hidden shadow-lg">
        {filteredPosts.map((post) => (
          <div key={post.id} class="px-6 py-4">
            <Link href={`/api/${post.id}`}>
              <id class="font-bold text-xl mb-4">{post.title}</id>
            </Link>{" "}
            <p class="text-gray-900 leading-none">By: {post.authorId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
