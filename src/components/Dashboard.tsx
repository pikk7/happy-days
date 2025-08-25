// src/components/Dashboard.tsx
import React from "react";
import Streak from "./Streak";
import PostForm from "./PostForm";
import type { User } from "../types/User";
import ActivityFeed from "./ActivityFeed";

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 space-y-6">
      {/* Navbar */}
      <nav className="bg-white p-4 rounded shadow mb-4">
        <h1 className="text-xl font-bold">Happy Days</h1>
      </nav>

      {/* Streak panel */}
      <Streak userId={user.uid} />

      {/* Add Post panel */}
      <PostForm user={user} />

      {/* ActivityFeed */}
      <ActivityFeed userId={user.uid} />
    </div>
  );
};

export default Dashboard;
