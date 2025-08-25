// src/components/Dashboard.tsx
import React from "react";
import FriendPanel from "./FriendPanel";
import Streak from "./Streak";
import PostForm from "./PostForm";

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      {/* Navbar */}
      <nav className="bg-white p-4 rounded shadow mb-4">
        <h1 className="text-xl font-bold">Happy Days</h1>
      </nav>

      {/* Streak panel */}
      <Streak userId={userId} />

      {/* Add Post panel */}
      <PostForm userId={userId} />

      {/* Friend Panel */}
      <FriendPanel userId={userId} />
    </div>
  );
};

export default Dashboard;
