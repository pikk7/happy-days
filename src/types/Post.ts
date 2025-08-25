import { Timestamp } from "firebase/firestore";

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
