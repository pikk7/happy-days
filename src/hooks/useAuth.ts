import { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import type { User } from "../types/User";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) setUser(null);
      else
        setUser({
          uid: u.uid,
          displayName: u.displayName || "Névtelen",
          email: u.email || "",
          photoURL: u.photoURL || "",
        });
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };
  const logout = async () => {
    await signOut(auth);
  };

  return { user, loading, login, logout };
}
