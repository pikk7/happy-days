import React from "react";

interface StreakProps {
  streak: number;
}

const Streak: React.FC<StreakProps> = ({ streak }) => {
  return (
    <div className="text-center bg-yellow-200 p-4 rounded">
      <p className="text-lg font-bold">Folyamatos napok: {streak}</p>
    </div>
  );
};

export default Streak;
