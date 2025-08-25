// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ActivityFeed from "./components/ActivityFeed";
import Profile from "./components/Profile";
import StreakAndStats from "./components/StreakAndStats";
import { useAuthState } from "./hooks/useAuth";
import FriendPanel from "./components/FriendPanel";

const App: React.FC = () => {
  const { user } = useAuthState();

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
            <Link to="/friends" className="hover:underline">
              Barátok
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
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/friends" element={  <FriendPanel userId={user.uid} />} />
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
