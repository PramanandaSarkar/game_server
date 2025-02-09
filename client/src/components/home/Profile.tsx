function Profile() {
  return (
    <div className="p-4 rounded-lg shadow-lg max-w-sm mx-auto bg-white">
      <h1 className="text-xl font-bold mb-4 text-center">Player Profile</h1>
      <div className="grid grid-cols-2 gap-y-3">
        <h2 className="text-gray-600 font-medium">Name:</h2>
        <h2 className="font-bold text-gray-800">Alan</h2>

        <h2 className="text-gray-600 font-medium">Rank:</h2>
        <h2 className="font-bold text-gray-800">1</h2>

        <h2 className="text-gray-600 font-medium">ID:</h2>
        <h2 className="font-bold text-gray-800">1</h2>

        <h2 className="text-gray-600 font-medium">Server ID:</h2>
        <h2 className="font-bold text-gray-800">1</h2>
      </div>
    </div>
  );
}

export default Profile;
