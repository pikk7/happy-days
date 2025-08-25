import React from "react";
import { auth } from "../firebase";

interface NavbarProps {
  userEmail: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ userEmail }) => {
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">100 Happy Days</h1>
      <div className="flex items-center space-x-4">
        {userEmail && <span className="hidden sm:inline">{userEmail}</span>}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
