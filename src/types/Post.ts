import { Timestamp } from "firebase/firestore";
import type { User } from "./User";

export type Visibility = "public" | "friends" | "private";

export interface Post {
  id: string;
  userId: string;
  displayName: string;
  content: string; // mindig "content", ne "text"
  createdAt: Timestamp;
  likes: string[]; // üres tömb alapértelmezetten
  visibility: Visibility;
  imageUrl?: string; // ha lesz kép
}

export type PostWithAuthor = Post & { author: User };
