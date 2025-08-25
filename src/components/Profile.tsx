// src/components/Profile.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ProfileProps {
  userId: string;
}

interface UserProfile {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  friends?: string[];
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    bio: "",
    avatarUrl: "",
    friends: [],
  });
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        setTempProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, "users", userId);
      await setDoc(docRef, tempProfile, { merge: true });
      setProfile(tempProfile);
      setMessage("Sikeres mentés!");
    } catch (err) {
      console.error(err);
      setMessage("Hiba történt a mentéskor.");
    }
  };

  if (loading) return <p>Betöltés...</p>;

  return (
    <div className="p-4 rounded shadow bg-white space-y-4 max-w-md mx-auto">
      <div className="flex items-center space-x-4">
        {tempProfile.avatarUrl ? (
          <img
            src={tempProfile.avatarUrl}
            alt="Avatar"
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            ?
          </div>
        )}
        <input
          type="text"
          value={tempProfile.displayName}
          placeholder="Név"
          className="border rounded p-1 flex-1"
          onChange={(e) =>
            setTempProfile({ ...tempProfile, displayName: e.target.value })
          }
        />
      </div>

      <textarea
        value={tempProfile.bio}
        placeholder="Rövid bio..."
        className="w-full border rounded p-2"
        onChange={(e) =>
          setTempProfile({ ...tempProfile, bio: e.target.value })
        }
      />

      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Mentés
      </button>

      {message && <p className="text-gray-500">{message}</p>}
    </div>
  );
};

export default Profile;
