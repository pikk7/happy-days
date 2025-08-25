import React, { useState } from "react";
import { addPost } from "../firebase";

interface PostFormProps {
  userId: string;
}

const PostForm: React.FC<PostFormProps> = ({ userId }) => {
  const [content, setContent] = useState("");
  const [shared, setShared] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await addPost(userId, content, shared);

    setContent("");
    setShared(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full p-2 border rounded"
        placeholder="Mitől voltál boldog ma?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={shared}
          onChange={(e) => setShared(e.target.checked)}
        />
        <span>Megosztom másokkal</span>
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Posztol
      </button>
    </form>
  );
};

export default PostForm;
