
import Games from '../components/home/Games'
import Profile from '../components/home/Profile'



const ProfilePage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 border rounded-2xl bg-white">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8  p-4 shadow-lg rounded-lg bg-gray-300">
      {/* Game menu */}
      <div className="bg-gray-200 p-4 rounded-lg">
        <Games />
      </div>

      {/* Profile details */}
      <div className="bg-gray-200 p-4 rounded-lg">
        <Profile />
      </div>
    </div>
  </div>
  )
}

export default ProfilePage