# 100 Happy Days Challenge

Egy mobilbarát React + TypeScript webalkalmazás a “100 Happy Days” kihíváshoz, Firebase Auth és Firestore integrációval.  
A felhasználók naponta posztolhatnak, hogy miért voltak boldogok, követhetik a streak-jüket, és láthatják a dashboardon a korábbi bejegyzéseiket.

---

## Főbb funkciók

- Firebase Authentication (email/jelszó)
- Firestore adatbázis a posztok tárolására
- Napi streak számítás
- Posztok listázása Dashboardon
- Tailwind CSS alapú reszponzív UI
- Navbar a felhasználó emailjével és logout gombbal
- Posztok privát és megosztható módja
- BeReal-szerű működés: mások posztjai csak akkor láthatók, ha te is posztoltál

---

## Követelmények

- Node.js >= 18
- npm >= 9
- Firebase fiók és projekt

---

## Telepítés

1. Klónozd a repót:

```bash
git clone https://github.com/USERNAME/happy-days.git
cd happy-days
```

2. Telepítsd a függőségeket:

```bash
npm install

```

3. Firebase konfiguráció hozzáadása (src/firebase.ts):

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Fejlesztés

A fejlesztői szerver indítása:

```bash
npm run dev
```

A böngészőben a http://localhost:5173 címen érhető el.

## Build

A production build készítése:

```bash
npm run build
```

Preview a build-re:

```bash
npm run preview
```

## Telepítés Firebase-re

1. Firebase CLI telepítése (ha nincs):

```bash
npm install -g firebase-tools
```

2. Bejelentkezés:

```bash
firebase login
```

3. Inicializálás (csak egyszer, ha új projekt):

```bash
firebase init
```

4. Deploy

```bash
firebase deploy
```
