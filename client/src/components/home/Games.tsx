import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Games() {
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const joinGame = async (playerCount: number) => {
    setWaiting(true);
    try {
      const response = await fetch('http://localhost:5000/join-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerCount })
      });
      const data = await response.json();
      setGameId(data.gameId);
    } catch (error) {
      console.error('Error joining game:', error);
      setWaiting(false);
    }
  };

  useEffect(() => {
    if (!gameId) return;
    const eventSource = new EventSource(`http://localhost:5000/game-status/${gameId}`);
    eventSource.onmessage = (event) => {
      const { status } = JSON.parse(event.data);
      if (status === 'started') {
        setGameStarted(true);
      }
    };
    return () => eventSource.close();
  }, [gameId]);

  useEffect(() => {
    if (gameStarted) {
      navigate(`/waiting`);
    }
  }, [gameStarted, gameId, navigate]);

  return (
    <div className="w-1/2 p-4 border rounded-lg">
      
      
        <h2 className="text-lg font-semibold mb-3 text-center">Guessing Game</h2>
        <div className="grid grid-cols-2 gap-4">
          {[2, 4, 6, 10].map((count) => (
            <button 
              key={count} 
              className="border p-2 rounded-md bg-gray-100 hover:bg-gray-300 transition hover:cursor-pointer"
              onClick={() => joinGame(count)}
              disabled={waiting}
            >
              {waiting ? 'Waiting...' : `${count}P`}
            </button>
          ))}
        </div>
      
    </div>
  );
}

export default Games;
