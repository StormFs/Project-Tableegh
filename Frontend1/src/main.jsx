import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/home";
import Quran from "./components/Quran";
import 'bootstrap/dist/css/bootstrap.min.css';
import Surah from "./components/Surah";
import { Auth0Provider } from '@auth0/auth0-react';
import { UserProvider } from './components/UserContext';
import LikedVerses from "./components/likedverses";

const doain = "project-tableegh.firebaseapp.com"
const clientId = "1:679343328871:web:d43b469e370e56d5078ec2"



export default function App() {
  return (
    <Auth0Provider
      domain={doain}
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
        <Route path="/quran/:surah_number" element={<Surah />} />
        <Route path="/liked-verses" element={<LikedVerses />} />
      </Routes>
      </UserProvider>
    </BrowserRouter>
    </Auth0Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);