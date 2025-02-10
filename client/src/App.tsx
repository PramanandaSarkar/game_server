import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GuessingGame from './pages/GuessingGame';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<ProfilePage />} />
          <Route path="/game/:players" element={<GuessingGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;