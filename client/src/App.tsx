import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import GuessingGame from './pages/GuessingGame';
import ProfilePage from './pages/ProfilePage';
// import WaitingPage from './pages/WaitingPage';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<ProfilePage />} />
          <Route path="/game/:matchId" element={<GuessingGame />} />
          {/* <Route path="/game/waiting" element={<WaitingPage />} /> */}
          {/* <Route path='/game/' /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;