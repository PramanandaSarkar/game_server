import { useState, useEffect } from "react";
import apiClient from "../api/api";
// import Games from "../components/home/Games";

type User = {
  id: string;
  server_id: string;
  rank: string;
  matchHistory: string[];
};

const getUserDetails = async (userId: string) => {
  try {
    const response = await apiClient.get(`/player/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const userId = localStorage.getItem("userId"); // Assuming user ID is stored in localStorage
  const [selectedType, setSelectedType] =  useState<string>("");

  useEffect(() => {
    if (userId) {
      getUserDetails(userId).then((data) => {
        if (data) setUser(data);
      });
    }
  }, [userId]);

  return (
    <div className="flex flex-row gap-10 p-6 w-6xl mx-auto min-h-screen">
      {/* Left Side - Games Section */}
      <div className="shadow-lg rounded-2xl w-2/3 bg-white p-6">
        <h1 className="text-2xl font-semibold text-black mb-4 text-center">Games</h1>
        <div className="w-1/2 p-4 border rounded-lg">
      
      
        <h2 className="text-lg font-semibold mb-3 text-center">Guessing Game</h2>
        <div className="grid grid-cols-2 gap-4">
          {[2, 4, 6, 10].map((count) => (
            <div
              key={count} 
              className="border p-2 rounded-md bg-gray-100 hover:bg-gray-300 transition hover:cursor-pointer"
              onClick={() => setSelectedType(`${count}P`)}              
            >
              {`${count}P`}
            </div>
          ))}
        </div>
        
      
    </div>
    <div className="mb-10 p-2 w-auto border rounded-lg">
      Start Match 
    </div>
      </div>

      {/* Right Side - Player Profile Section */}
      <div className="shadow-lg rounded-2xl w-1/3 bg-white p-6">
        <h1 className="text-2xl font-semibold text-black mb-4 text-center">Player Profile</h1>

        {user ? (
          <div className="space-y-3">
            <p className="text-lg text-gray-700">
              <span className="font-medium">User ID:</span> {user.id}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Server ID:</span> {user.server_id}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Rank:</span> {user.rank}
            </p>

            <h2 className="  mt-6">Last 5 Match History</h2>
            <ul className="list-disc list-inside text-gray-700">
              {user.matchHistory?.slice(0, 5).map((match: string, index: number) => (
                <li key={index} className="text-sm">{match}</li>
              )) || <p className="text-gray-500">No recent matches found.</p>}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Loading user data...</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
