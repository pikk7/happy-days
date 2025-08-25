export type Visibility = "private" | "public";

export type Post = {
  id?: string;
  userId: string;
  userName: string;
  dateKey: string; // YYYY-MM-DD
  text: string;
  imageUrl: string | null;
  visibility: Visibility;
  createdAt?: any; // Firestore Timestamp
  hearts: number;
};
