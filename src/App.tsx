// src/App.tsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ActivityFeed from "./components/ActivityFeed";
import Profile from "./components/Profile";
import StreakAndStats from "./components/StreakAndStats";
import { useAuthState } from "./hooks/useAuth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const App: React.FC = () => {
  const { user } = useAuthState();
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchFriends = async () => {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFriends(data.friends || []);
      }
    };

    fetchFriends();
  }, [user]);

  if (!user) return <p>Bejelentkezés szükséges...</p>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold">Happy Days</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/feed" className="hover:underline">
              Aktivitás
            </Link>
            <Link to="/profile" className="hover:underline">
              Profil
            </Link>
            <Link to="/stats" className="hover:underline">
              Streak & Stats
            </Link>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-4 bg-gray-50">
          <Routes>
            <Route path="/" element={<Dashboard userId={user.uid} />} />
            <Route
              path="/feed"
              element={<ActivityFeed userId={user.uid} friends={friends} />}
            />
            <Route path="/profile" element={<Profile userId={user.uid} />} />
            <Route
              path="/stats"
              element={<StreakAndStats userId={user.uid} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
