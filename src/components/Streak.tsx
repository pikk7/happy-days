import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

interface StreakProps {
  userId: string;
}

const Streak: React.FC<StreakProps> = ({ userId }) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const calculateStreak = async () => {
      const q = query(
        collection(db, "posts"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const dates = snapshot.docs.map((doc) => doc.data().createdAt.toDate());

      let currentStreak = 0;
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let d of dates) {
        const postDay = new Date(d);
        postDay.setHours(0, 0, 0, 0);
        if (+today === +postDay) {
          currentStreak++;
          today.setDate(today.getDate() - 1);
        } else if (+today - +postDay === 86400000) {
          currentStreak++;
          today.setDate(today.getDate() - 1);
        } else {
          break;
        }
      }

      setStreak(currentStreak);
    };

    calculateStreak();
  }, [userId]);

  return (
    <div className="p-4 bg-yellow-100 rounded text-center font-bold">
      Napi streak: {streak} nap
    </div>
  );
};

export default Streak;
