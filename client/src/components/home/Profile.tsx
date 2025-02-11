// take user id from local storage
// get user details from api
// display user details

import { useState, useEffect } from "react";
import { getUserDetails } from "../../api/player/profileData.ts"; // Import API function

function Profile() {
  const [user, setUser] = useState<{ name: string; rank: number; id: number; serverId: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("No user found. Please log in.");
      return;
    }

    // Fetch user details
    getUserDetails(userId)
      .then((data) => setUser(data))
      .catch(() => setError("Failed to fetch user details."));
  }, []);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!user) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-4 rounded-lg shadow-lg max-w-sm mx-auto bg-white">
      <h1 className="text-xl font-bold mb-4 text-center">Player Profile</h1>
      <div className="grid grid-cols-2 gap-y-3">
        <h2 className="text-gray-600 font-medium">Name:</h2>
        <h2 className="font-bold text-gray-800">{user.name}</h2>

        <h2 className="text-gray-600 font-medium">Rank:</h2>
        <h2 className="font-bold text-gray-800">{user.rank}</h2>

        <h2 className="text-gray-600 font-medium">ID:</h2>
        <h2 className="font-bold text-gray-800">{user.id}</h2>

        <h2 className="text-gray-600 font-medium">Server ID:</h2>
        <h2 className="font-bold text-gray-800">{user.serverId}</h2>
      </div>
    </div>
  );
}

export default Profile;

