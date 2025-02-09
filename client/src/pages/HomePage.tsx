import { useNavigate } from "react-router-dom";
import Profile from "../components/home/Profile";


function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 gap-8">
        {/* Game menu */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h1 className="text-xl font-bold mb-4">Multiplayer Guessing Game</h1>
          <div>
            {[2, 4, 6, 10].map((count) => (
              <button 
                key={count} 
                className="text-lg text-white bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={() => navigate(`/game/${count}`)}
              >
                {count} Player Mode
              </button>
            ))}
          </div>
        </div>
        {/* Profile details */}
        <Profile />
      </div>
    </div>
  );
}

export default HomePage;