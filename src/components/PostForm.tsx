import React, { useState } from "react";
import { addPost } from "../firebase";
import type { User } from "../types/User";
import type { Visibility } from "../types/Post";

interface PostFormProps {
  user: User;
}

const PostForm: React.FC<PostFormProps> = ({ user }) => {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("friends");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await addPost(user.uid, content, visibility, user.displayName);
      setContent("");
      setVisibility("friends");
    } catch (error) {
      console.error("Hiba a posztolásnál:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Új poszt létrehozása
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
          placeholder="Mitől voltál boldog ma?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-gray-700">
            <span>Láthatóság:</span>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as Visibility)}
              className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="public">Mindenki</option>
              <option value="friends">Csak barátok</option>
              <option value="private">Csak én</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Posztolás..." : "Posztol"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
