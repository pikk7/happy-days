import { db, storage } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import type { Post, Visibility } from "../types/Post";
import { todayKey } from "../lib/date";

export async function getMyLastPostDate(uid: string) {
  const uref = doc(db, "users", uid);
  const snap = await getDoc(uref);
  return snap.exists() ? (snap.data().lastPostDate as string | null) : null;
}

export async function setMyLastPostDate(uid: string, dateKey: string) {
  const uref = doc(db, "users", uid);
  await setDoc(
    uref,
    { lastPostDate: dateKey, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function createPost(params: {
  uid: string;
  userName: string;
  content: string;
  imageUrl: string | null;
  visibility: Visibility;
}) {
  const dateKey = todayKey();
  const pcol = collection(db, "posts");
  const post: Post = {
    userId: params.uid,
    userName: params.userName,
    dateKey,
    content: params.content || "",
    imageUrl: params.imageUrl || null,
    visibility: params.visibility,
    hearts: 0,
  };
  await addDoc(pcol, { ...post, createdAt: serverTimestamp() });
  await setMyLastPostDate(params.uid, dateKey);
}

export function subscribeTodayPublicPosts(cb: (items: Post[]) => void) {
  const pcol = collection(db, "posts");
  const q = query(
    pcol,
    where("visibility", "==", "public"),
    where("dateKey", "==", todayKey()),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Post) })));
  });
}

export async function listMyPosts(uid: string) {
  const pcol = collection(db, "posts");
  const q = query(
    pcol,
    where("userId", "==", uid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Post) }));
}

export async function uploadImage(uid: string, file: File) {
  const key = `${uid}/${Date.now()}_${file.name}`;
  const refx = storageRef(storage, `images/${key}`);
  await uploadBytes(refx, file);
  const url = await getDownloadURL(refx);
  return url;
}
