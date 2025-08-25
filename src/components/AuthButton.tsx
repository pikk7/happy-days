import React from "react";
import { signInWithGoogle } from "../firebase";
import type { User } from "firebase/auth";

interface AuthButtonProps {
  onLogin: (user: User) => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ onLogin }) => {
  const handleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      onLogin(user);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
    >
      Bejelentkezés Google fiókkal
    </button>
  );
};

export default AuthButton;
