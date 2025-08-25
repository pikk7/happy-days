export type User = {
  uid: string; // pl. Firebase UID vagy email
  email: string; // email
  displayName: string; // név amit mutatunk
  photoURL?: string; // profilkép
  friends?: string[]; // barátok userId listája
  friendRequests?: string[]; // beérkező jelölések
  sentRequests?: string[]; // elküldött jelölések
};
