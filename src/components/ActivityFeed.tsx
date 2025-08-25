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
  getDoc,
} from "firebase/firestore";
import type { Post } from "../types/Post";
import type { User } from "../types/User";

interface ActivityFeedProps {
  userId: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [friends, setFriends] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!friends) {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) return;

        const data = docSnap.data() as User;

        setFriends(data?.friends || []);
      }
    };
    fetchFriends();
  }, [userId]);

  useEffect(() => {
    const postsRef = collection(db, "posts");
    let q;
    if (friends && friends.length > 0) {
      // Csak barátok posztjai + saját poszt
      q = query(
        postsRef,
        where("userId", "in", friends.concat(userId)),
        orderBy("createdAt", "desc")
      );
    } else {
      // Csak saját posztok
      q = query(
        postsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
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
      await updateDoc(postRef, { likes: arrayRemove(userId) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(userId) });
    }
  };

  const canViewContent = (post: Post) => {
    if (post.userId === userId) return true; // Saját poszt mindig látható
    if (post.visibility === "public") return true;
    if (post.visibility === "friends" && friends?.includes(post.userId))
      return true;
    return false;
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
        >
          <div className="font-bold">{post.displayName}</div>
          <div>{canViewContent(post) ? post.content : "Ez a poszt privát"}</div>
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
