import { useState, useEffect } from "react";
import apiClient from "../api/api";
// import { useNavigate } from "react-router-dom";
import Games from "../components/home/Games";


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
  // const [selectedType, setSelectedType] = useState<string>("");
  // const [waiting, setWaiting] = useState<boolean>(false);
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [match, setMatch] = useState< any >(null);
  // const navigate = useNavigate();

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
      <Games />

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

            <h2 className="mt-6">Last 5 Match History</h2>
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
