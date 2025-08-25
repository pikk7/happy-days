import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

interface Post {
  id: string;
  createdAt: Timestamp;
  shared: boolean;
}

interface StreakAndStatsProps {
  userId: string;
}

const StreakAndStats: React.FC<StreakAndStatsProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "posts"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userPosts: Post[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, "id">),
      }));

      setPosts(userPosts);
      calculateStreak(userPosts);
    });

    return () => unsubscribe();
  }, [userId]);

  const calculateStreak = (userPosts: Post[]) => {
    const sorted = userPosts
      .map((p) => p.createdAt.toDate())
      .sort((a, b) => b.getTime() - a.getTime());

    let count = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const d of sorted) {
      const postDate = new Date(d);
      postDate.setHours(0, 0, 0, 0);

      if (postDate.getTime() === today.getTime()) {
        count++;
        today.setDate(today.getDate() - 1);
      } else if (postDate.getTime() === today.getTime() - 86400000) {
        count++;
        today.setDate(today.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(count);
  };

  const totalPosts = posts.length;
  const sharedPosts = posts.filter((p) => p.shared).length;
  const sharedPercent = totalPosts
    ? Math.round((sharedPosts / totalPosts) * 100)
    : 0;

  return (
    <div className="space-y-4 p-4 bg-yellow-50 rounded shadow">
      <h2 className="text-xl font-semibold">Statisztika</h2>
      <div className="flex justify-between">
        <div>
          <p className="font-medium">Napi streak</p>
          <p className="text-2xl">{streak} nap</p>
        </div>
        <div>
          <p className="font-medium">Összes poszt</p>
          <p className="text-2xl">{totalPosts}</p>
        </div>
        <div>
          <p className="font-medium">Megosztott posztok</p>
          <p className="text-2xl">{sharedPercent}%</p>
        </div>
      </div>

      {totalPosts > 0 && (
        <div>
          <p className="font-medium mb-1">Megosztott posztok aránya</p>
          <div className="w-full h-4 bg-gray-300 rounded">
            <div
              className="h-4 bg-green-400 rounded"
              style={{ width: `${sharedPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakAndStats;
