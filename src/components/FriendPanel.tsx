import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

interface FriendPanelProps {
  userId: string;
}

interface User {
  uid?: string; // dokumentum ID
  displayName: string;
  email: string;
  friends?: string[];
  friendRequests?: string[];
}

const FriendPanel: React.FC<FriendPanelProps> = ({ userId }) => {
  const [friendEmail, setFriendEmail] = useState("");
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [message, setMessage] = useState("");

  const fetchUserData = async () => {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) return;

    const data = docSnap.data() as User;

    // Friend requests
    if (data.friendRequests?.length) {
      const requestsData: User[] = [];
      for (const uid of data.friendRequests) {
        const reqSnap = await getDoc(doc(db, "users", uid));
        if (reqSnap.exists())
          requestsData.push({ ...(reqSnap.data() as User), uid: reqSnap.id });
      }
      setFriendRequests(requestsData);
    } else {
      setFriendRequests([]);
    }

    // Friends
    if (data.friends?.length) {
      const friendsData: User[] = [];
      for (const uid of data.friends) {
        const friendSnap = await getDoc(doc(db, "users", uid));
        if (friendSnap.exists())
          friendsData.push({
            ...(friendSnap.data() as User),
            uid: friendSnap.id,
          });
      }
      setFriends(friendsData);
    } else {
      setFriends([]);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const handleAddFriend = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", friendEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage("Felhasználó nem található.");
        return;
      }

      const friendUid = querySnapshot.docs[0].id;
      const friendRef = doc(db, "users", friendUid);

      await updateDoc(friendRef, {
        friendRequests: arrayUnion(userId),
      });

      setMessage("Barátkérés elküldve!");
      setFriendEmail("");
    } catch (err) {
      console.error(err);
      setMessage("Hiba történt a barátkérés küldésekor.");
    }
  };

  const handleAccept = async (friendUid: string) => {
    try {
      const myRef = doc(db, "users", userId);
      const friendRef = doc(db, "users", friendUid);

      // Saját user frissítése
      await updateDoc(myRef, {
        friends: arrayUnion(friendUid),
        friendRequests: arrayRemove(friendUid),
      });

      // Másik fél frissítése
      await updateDoc(friendRef, {
        friends: arrayUnion(userId),
      });

      setMessage("Barát elfogadva!");
      fetchUserData();
    } catch (err) {
      console.error(err);
      setMessage("Hiba történt az elfogadás során.");
    }
  };

  const handleDecline = async (friendUid: string) => {
    try {
      const myRef = doc(db, "users", userId);
      await updateDoc(myRef, {
        friendRequests: arrayRemove(friendUid),
      });
      setMessage("Barátkérés elutasítva.");
      fetchUserData();
    } catch (err) {
      console.error(err);
      setMessage("Hiba történt az elutasítás során.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto space-y-4">
      {/* Add Friend */}
      <div className="space-y-2">
        <h2 className="font-bold">Barát keresése</h2>
        <input
          type="email"
          placeholder="Barát email"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          onClick={handleAddFriend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Küldés
        </button>
      </div>

      {/* Friend Requests */}
      <div className="space-y-2">
        <h2 className="font-bold">Barátkérelmek</h2>
        {friendRequests.length === 0 && <p>Nincsenek kérések</p>}
        {friendRequests.map((req) => (
          <div
            key={req.uid}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span>{req.displayName || req.email}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleAccept(req.uid!)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
              >
                Elfogad
              </button>
              <button
                onClick={() => handleDecline(req.uid!)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Elutasít
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Friends */}
      <div className="space-y-2">
        <h2 className="font-bold">Barátok</h2>
        {friends.length === 0 && <p>Nincsenek barátok</p>}
        {friends.map((f) => (
          <div key={f.uid} className="border p-2 rounded">
            {f.displayName || f.email}
          </div>
        ))}
      </div>

      {message && <p className="text-gray-500">{message}</p>}
    </div>
  );
};

export default FriendPanel;
