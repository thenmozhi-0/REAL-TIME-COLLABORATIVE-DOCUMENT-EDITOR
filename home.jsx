import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const createDoc = () => {
    const id = uuidv4();
    navigate(`/doc/${id}`, { state: { title } });
  };

  return (
    <div className="container">
      <h1>Real‑Time Collaborative Document</h1>
      <p className="muted">React + Socket.IO + MongoDB</p>

      <div className="card">
        <label>Optional Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
        />
        <button onClick={createDoc}>Create Document</button>
      </div>

      <div className="info">
        <p>Share the document URL so others can join and edit together.</p>
      </div>
    </div>
  );
}
