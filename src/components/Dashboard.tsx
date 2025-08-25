import React from "react";

interface DashboardProps {
  posts: { text: string; createdAt: any; userId: string }[];
}

const Dashboard: React.FC<DashboardProps> = ({ posts }) => {
  return (
    <div className="space-y-2">
      {posts.length === 0 ? (
        <p>Nincsenek posztok még.</p>
      ) : (
        posts.map((post, i) => (
          <div key={i} className="border p-2 rounded bg-white">
            <p>{post.text}</p>
            <small className="text-gray-500">
              {post.createdAt.toDate().toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
