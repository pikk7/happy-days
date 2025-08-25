import { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";

export type MiniUser = { uid: string; name: string; photo: string | null };

export function useAuthState() {
  const [user, setUser] = useState<MiniUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) setUser(null);
      else
        setUser({
          uid: u.uid,
          name: u.displayName || "Névtelen",
          photo: u.photoURL || null,
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
