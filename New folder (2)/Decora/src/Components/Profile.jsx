import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Importing an icon for the go-back button

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg relative">
        
        {/* Go Back Button */}
        <button
          className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-gray-800"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Profile Header */}
        <div className="flex flex-col items-center mt-8">
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-36 h-36 rounded-full border-4 border-gray-300 shadow-md"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            {user.name || "User Name"}
          </h2>
          <p className="text-gray-600">{user.email || "user@example.com"}</p>
        </div>

        {/* User Details */}
        <div className="mt-6 space-y-4 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Address:</span>
            <span>{user.address || "N/A"}</span>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6 text-center">
          <button
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
