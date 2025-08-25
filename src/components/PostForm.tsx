import React, { useState } from "react";
import { addPost } from "../firebase";

interface PostFormProps {
  userId: string;
}

const PostForm: React.FC<PostFormProps> = ({ userId }) => {
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addPost(text, userId);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Miért vagy ma boldog?"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Posztolj
      </button>
    </form>
  );
};

export default PostForm;
