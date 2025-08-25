import { useState, useEffect } from "react";
import { auth, postsQuery } from "./firebase";
import PostForm from "./components/PostForm";
import Dashboard from "./components/Dashboard";
import Streak from "./components/Streak";
import { onSnapshot } from "firebase/firestore";
import type { User } from "firebase/auth";
import AuthButton from "./components/AuthButton";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<
    { text: string; createdAt: any; userId: string }[]
  >([]);
  const [streak, setStreak] = useState<number>(0);

  // Firebase Auth state figyelése
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Firestore posztok figyelése
  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const allPosts: any[] = [];
      snapshot.forEach((doc) => allPosts.push(doc.data()));
      setPosts(allPosts);
      calculateStreak(allPosts, user.uid);
    });
    return () => unsubscribe();
  }, [user]);

  // Egyszerű streak számítás
  const calculateStreak = (allPosts: any[], userId: string) => {
    const userPosts = allPosts
      .filter((p) => p.userId === userId)
      .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

    let count = 0;
    let today = new Date();
    for (const post of userPosts) {
      const postDate = post.createdAt.toDate();
      if (
        postDate.toDateString() === today.toDateString() ||
        postDate.toDateString() ===
          new Date(today.getTime() - 86400000).toDateString()
      ) {
        count++;
        today = postDate;
      } else {
        break;
      }
    }
    setStreak(count);
  };

  if (!user) return <AuthButton onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold">100 Happy Days Challenge</h1>
      </header>
      <Navbar userEmail={user.email} />

      <main className="max-w-xl mx-auto space-y-6">
        <Streak streak={streak} />
        <PostForm userId={user.uid} />
        <Dashboard posts={posts} />
      </main>
    </div>
  );
}

export default App;
