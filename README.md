# REAL-TIME-COLLABORATIVE-DOCUMENT-EDITOR
# CODTECH Internship – Task 3
Real‑Time Collaborative Document Editor (React + Node.js + Socket.IO + MongoDB)

## Quick Start
1) Open 2 terminals (or use `concurrently`).
2) **Server**
   ```bash
   cd server
   cp .env.example .env   # then edit MONGO_URI and CLIENT_ORIGIN if needed
   npm install
   npm run dev
   ```
3) **Client**
   ```bash
   cd client
   cp .env.example .env   # optional: set VITE_SERVER_URL if the server isn't on localhost:5000
   npm install
   npm run dev
   ```
4) Visit http://localhost:5173 and click **Create Document**. Share the URL to collaborate in real time.

---

## Tech
- **Frontend**: React (Vite), React Router, React‑Quill (Quill editor), Socket.IO client
- **Backend**: Node.js, Express, Socket.IO, MongoDB (Mongoose)
- **Sync model**: Quill Delta ops broadcast via Socket.IO + periodic persistence to MongoDB

## Project Structure
```
codtech-task3-collab-editor/
├── client/          # React app (Vite)
└── server/          # Express + Socket.IO + Mongoose
```

## How it Works (High Level)
- Clients connect to a `documentId` room via Socket.IO.
- Local edits fire Quill `text-change` events (Deltas).
- We emit `send-changes` to the room; other clients apply `receive-changes` via `quill.updateContents`.
- Every 2 seconds the client emits `save-document` with the current Quill contents.
- The server stores the latest `data` (Quill Delta JSON) in MongoDB.

## Notes
- This is a clean starting point: production hardening (auth, presence, rate-limits, access control, versioning) can be added later.
- To use **PostgreSQL** instead of MongoDB, replace Mongoose with a table that stores `id (text primary key)` and `data (jsonb)`, and swap persistence calls.
