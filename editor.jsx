
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { io as ioClient } from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const SAVE_INTERVAL_MS = 2000;

export default function Editor() {
  const { id: documentId } = useParams();
  const location = useLocation();
  const [socket, setSocket] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [title, setTitle] = useState(location?.state?.title || "Untitled");

  const quillRef = useRef(null);

  const serverURL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  // connect socket
  useEffect(() => {
    const s = ioClient(serverURL);
    setSocket(s);
    return () => s.disconnect();
  }, [serverURL]);

  // load / join document room
  useEffect(() => {
    if (!socket) return;
    socket.once("load-document", (document) => {
      const quill = quillRef.current.getEditor();
      quill.setContents(document || { ops: [] });
      quill.enable(true);
      setIsReady(true);
    });
    socket.emit("get-document", documentId);
  }, [socket, documentId]);

  // send changes
  const handleChange = useCallback((delta, oldDelta, source) => {
    if (source !== "user" || !socket) return;
    socket.emit("send-changes", delta);
  }, [socket]);

  // receive changes
  useEffect(() => {
    if (!socket) return;
    const receive = (delta) => {
      const quill = quillRef.current.getEditor();
      quill.updateContents(delta);
    };
    socket.on("receive-changes", receive);
    return () => socket.off("receive-changes", receive);
  }, [socket]);

  // periodic save
  useEffect(() => {
    if (!socket) return;
    const interval = setInterval(() => {
      const quill = quillRef.current.getEditor();
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [socket]);

  // rename document
  const rename = () => {
    if (socket) socket.emit("rename-document", title);
  };

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "code-block"],
      ["clean"],
    ],
    history: { delay: 500, maxStack: 100, userOnly: true }
  }), []);

  return (
    <div className="editor-wrap">
      <div className="editor-bar">
        <input
          className="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={rename}
        />
        <span className="status">
          {isReady ? "All changes saved • Share this URL to collaborate" : "Loading…"}
        </span>
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        onChange={handleChange}
        modules={modules}
        placeholder="Start typing with your team…"
        readOnly={!isReady}
      />
    </div>
  );
}
