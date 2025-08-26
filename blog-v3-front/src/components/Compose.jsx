import React, { useState } from "react";
import "./css/compose.css";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Compose({ user }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const author =
        user?.username || user?.name || "Anonymous";
      const res = await api.post("/compose", { title, content, author });
      alert(res.data || "Saved!");
      navigate("/");
    } catch (error) {
      alert("Failed to save post");
    }
  }

  return (
    <div className="base-container">
      <h1>Compose</h1>
      <h2>Compose Posts here, {user?.name}</h2>
      <form method="post" className="compose-form" onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          maxLength={50}
          required
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label className="contentn">Content:</label>
        <textarea
          name="content"
          cols={90}
          rows={10}
          maxLength={500}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Compose;
