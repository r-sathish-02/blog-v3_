import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import api from "../api";
import "./css/home.css";

function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    Promise.all([
      api.get("/posts").then((r) => (ignore ? null : setPosts(r.data || []))),
      new Promise((res) => setTimeout(res, 600)), // small UX delay so spinner is visible
    ])
      .catch(() => !ignore && setPosts([]))
      .finally(() => !ignore && setLoading(false));

    return () => { ignore = true; };
  }, []);

  if (loading) return <div className="spinner-load"><Spinner /></div>;

  return (
    <div className="post-container">
      {user ? <h2>Welcome, {user.name}</h2> : null}
      <h1>Blog Posts</h1>

      {posts.length === 0 ? (
        <p className="no-posts">
          No posts yet.&nbsp;
          {user ? "Go to Compose and create your first post!" : "Login to add one."}
        </p>
      ) : (
        posts.map((post, index) => (
          <div key={index} className="posts">
            <h2>{post.title}</h2>
            {post.author && <h3>&nbsp;&nbsp;&nbsp;- {post.author}</h3>}
            <p>{post.content}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
