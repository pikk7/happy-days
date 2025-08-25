// src/components/FriendRequests.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

interface FriendRequestsProps {
  userId: string;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ userId }) => {
  const [requests, setRequests] = useState<string[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRequests(data.friendRequests || []);
      }
    };

    fetchRequests();
  }, [userId]);

  const handleAccept = async (friendUid: string) => {
    const myRef = doc(db, "users", userId);
    const friendRef = doc(db, "users", friendUid);

    // Saját friends tömb frissítése
    await updateDoc(myRef, {
      friends: arrayUnion(friendUid),
      friendRequests: arrayRemove(friendUid),
    });

    // Barát friends tömb frissítése
    await updateDoc(friendRef, {
      friends: arrayUnion(userId),
    });

    setRequests((prev) => prev.filter((uid) => uid !== friendUid));
  };

  const handleDecline = async (friendUid: string) => {
    const myRef = doc(db, "users", userId);
    await updateDoc(myRef, {
      friendRequests: arrayRemove(friendUid),
    });
    setRequests((prev) => prev.filter((uid) => uid !== friendUid));
  };

  if (requests.length === 0) return <p>Nincsenek barátkérelmek.</p>;

  return (
    <div className="space-y-2 max-w-md mx-auto p-4 bg-white rounded shadow">
      {requests.map((uid) => (
        <div key={uid} className="flex justify-between items-center">
          <span>{uid}</span> {/* később lehet név lekérés Firestore-ból */}
          <div className="space-x-2">
            <button
              onClick={() => handleAccept(uid)}
              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
            >
              Elfogad
            </button>
            <button
              onClick={() => handleDecline(uid)}
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Elutasít
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequests;
