// src/components/ActivityFeed.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
} from "firebase/firestore";
import type { Post } from "../types/Post";

interface ActivityFeedProps {
  userId: string;
  friends?: string[]; // csak barátok posztjai
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ userId, friends }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    let q;
    if (friends && friends.length > 0) {
      q = query(
        postsRef,
        where("userId", "in", friends.concat(userId)),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(postsRef, orderBy("createdAt", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts: Post[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Post, "id">),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, [userId, friends]);

  const toggleLike = async (postId: string, likes: string[] = []) => {
    const postRef = doc(db, "posts", postId);
    if (likes.includes(userId)) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded shadow space-y-2">
          <div className="font-bold">{post.displayName}</div>
          <div>{post.content}</div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toggleLike(post.id, post.likes)}
              className={`px-3 py-1 rounded ${
                post.likes?.includes(userId)
                  ? "bg-red-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {post.likes?.includes(userId) ? "Liked" : "Like"} (
              {post.likes?.length || 0})
            </button>
            <span className="text-gray-500 text-sm">
              {post.createdAt?.toDate().toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
