import React from 'react';
import { useNavigate } from 'react-router-dom';

function Games() {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 text-center">Game Menu</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-center">Guessing Game</h2>
        <div className="grid grid-cols-2 gap-4">
          {[2, 4, 6, 10].map((count) => (
            <button 
              key={count} 
              className="border p-2 rounded-md bg-gray-100 hover:bg-gray-300 transition hover:cursor-pointer"
              onClick={() => navigate(`/game/${count}`)} // Fixed this line
            >
              {count}P
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Games;
