import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LoginButton from './components/LoginButton';
import Hadith from './components/Hadith';
import HadithChapters from './components/HadithChapters';
import Chapters from './components/Chapters';
import IndividualHadith from './components/IndividualHadith';

const App = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Router>
      <div>
        <Navbar />
        {isAuthenticated ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hadith" element={<Hadith />} />
            <Route path="/hadith/:book_id/chapters" element={<HadithChapters />} />
            <Route path="/hadith/:book_id/chapters/:chapter" element={<Chapters />} />
            <Route path="/hadith/:chapter/:hadith_id" element={<IndividualHadith />} />
          </Routes>
        ) : (
          <LoginButton />
        )}
      </div>
    </Router>
  );
};

export default App
