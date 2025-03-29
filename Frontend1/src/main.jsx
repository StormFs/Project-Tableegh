import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Quran from "./components/Quran";
import 'bootstrap/dist/css/bootstrap.min.css';
import Surah from "./components/Surah";
import { Auth0Provider } from '@auth0/auth0-react';
import { UserProvider } from './components/UserContext';
import LikedVerses from "./components/likedverses";
import Profile from "./components/Profile";
const domain = "project-tableegh.firebaseapp.com"
const clientId = "1:679343328871:web:d43b469e370e56d5078ec2"
import Hadith from "./components/Hadith";
import HadithChapters from "./components/HadithChapters"
import Chapters from "./components/Chapters"
import LikedHadiths from "./components/Likedhadith"
import Searched from "./components/Searched";


export default function App() {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
    <BrowserRouter>
      <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/quran" element={<Quran />} />
        <Route path="/hadith" element={<Hadith />} />
        <Route path="/hadith/:book_id/chapters" element={<HadithChapters />} />
        <Route path="/hadith/:book_id/chapters/:chapter" element={<Chapters />} />
        <Route path="/quran/:surah_number" element={<Surah />} />
        <Route path="/liked-verses" element={<LikedVerses />} />
        <Route path="/liked-hadith" element={<LikedHadiths />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/searched/:search" element={<Searched />} />
      </Routes>
      </UserProvider>
    </BrowserRouter>
    </Auth0Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);