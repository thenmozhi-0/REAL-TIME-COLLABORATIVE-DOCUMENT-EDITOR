const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // documentId
    title: { type: String, default: "Untitled" },
    data: { type: Object, default: { ops: [] } }, // Quill Delta JSON
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
