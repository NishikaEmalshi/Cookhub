import React, { useState } from "react";
import { useNavigate } from "react-router";
import { mainu } from "../Sidebar/SidebarConfig";
import SearchComponent from "../SearchComponent/SearchComponent";
import { useSelector } from "react-redux";
import { IoReorderThreeOutline } from "react-icons/io5";
import CreatePostModal from "../Post/Create/CreatePostModal";
import spiceupImage from '../../assets/logo.png';


const Navbar = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { user } = useSelector((store) => store);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSearchQuery(""); // Clear search on tab change

    if (tab === "Profile") navigate(`/${user.reqUser?.username}`);
    else if (tab === "Home") navigate("/");
    else if (tab === "About Us") navigate("/about");
    else if (tab === "Create Post") setIsPostModalOpen(true);
    else if (tab === "Learning Plan") navigate("/learning_plan");
    else if (tab === "Learning Progress") navigate("/learning-progress");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-white shadow">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left logo */}
        <img
          src={spiceupImage}
          alt="SpiceUp Logo"
          className="w-32"
        />


        {/* Center tabs and search */}
        <div className="relative flex items-center justify-center flex-1 space-x-4">
          {mainu.map((item, index) => (
            <div
              key={index}
              onClick={() => handleTabClick(item.title)}
              className={`cursor-pointer px-3 py-1 rounded-md text-sm ${
                activeTab === item.title
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.title}
            </div>
          ))}

          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {searchQuery.trim() !== "" && (
              <div className="absolute left-0 z-50 w-64 overflow-y-auto bg-white border rounded shadow-md top-10 max-h-80">
                <SearchComponent query={searchQuery} />
              </div>
            )}
          </div>
        </div>

        {/* Right side: logout + dropdown */}
        <div className="relative flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            Log out
          </button>

        
        </div>
      </div>

      {/* Modals */}
      <CreatePostModal onClose={() => setIsPostModalOpen(false)} isOpen={isPostModalOpen} />
    </div>
  );
};

export default Navbar;
