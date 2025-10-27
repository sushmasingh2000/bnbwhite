import React, { useState } from "react";
import { FaHome, FaWallet, FaPlusCircle, FaBolt, FaUser, FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  FaCoins,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaNetworkWired,
  FaSignOutAlt,
  FaUserCog,
} from "react-icons/fa";
import { ArrowRight, PixRounded } from "@mui/icons-material";
import {
  MdLeaderboard,
  MdEmojiEvents,
  MdAttachMoney,
  MdAccountBalanceWallet,
  MdGroups,
  MdSettings,
  MdTrendingUp,
} from "react-icons/md";
import {
  RiStackLine,
  RiTeamLine,
  RiExchangeDollarLine,
  RiCoinsLine,
} from "react-icons/ri";
import { TbMoneybag, TbArrowBadgeRightFilled } from "react-icons/tb";


const BottomNavigationBar = () => {
  const [value, setValue] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();


const menuItems = [
  {
    title: "Level Income",
    icon: <MdLeaderboard className="text-orange-500" />,
    path: "/income/level",
    color: "#F97316", // orange
  },
  {
    title: "ROI Income",
    icon: <MdTrendingUp className="text-emerald-500" />,
    path: "/income/roi",
    color: "#10B981", // green
  },
  {
    title: "Upline Income",
    icon: <RiStackLine className="text-red-500" />,
    path: "/income/direct",
    color: "#EF4444", // red
  },
  {
    title: "Reward Bonus",
    icon: <MdEmojiEvents className="text-indigo-500" />,
    path: "/income/reward",
    color: "#6366F1", // indigo
  },
  {
    title: "Activation",
    icon: <TbMoneybag className="text-pink-500" />,
    path: "/activation",
    color: "#EC4899", // pink
  },
  {
    title: "TopUp",
    icon: <RiCoinsLine className="text-violet-500" />,
    path: "/topup_data",
    color: "#8B5CF6", // violet
  },
  {
    title: "Withdrawal",
    icon: <MdAccountBalanceWallet className="text-yellow-500" />,
    path: "/with",
    color: "#EAB308", // yellow
  },
  {
    title: "Payout",
    icon: <RiExchangeDollarLine className="text-orange-400" />,
    path: "/withdrawal",
    color: "#F97316", // orange
  },
  {
    title: "ClaimTopUp",
    icon: <TbArrowBadgeRightFilled className="text-purple-500" />,
    path: "/claim_topup",
    color: "#A855F7", // purple
  },
  {
    title: "Direct Team",
    icon: <MdGroups className="text-sky-500" />,
    path: "/referral",
    color: "#0EA5E9", // sky
  },
  {
    title: "Downline Team",
    icon: <RiTeamLine className="text-teal-500" />,
    path: "/downline",
    color: "#14B8A6", // teal
  },
  
  {
    title: "Profile Settings",
    icon: <MdSettings className="text-gray-500" />,
    path: "/profile",
    color: "#6B7280", // gray
  },
  {
    title: "Logout",
    icon: <FaSignOutAlt className="text-red-600" />,
    color: "#DC2626",
    onClick: () => {
      localStorage.clear();
      navigate("/");
    },
  },
];


  const handleMenuClick = (title, path, onClick) => {
    setShowSidebar(false);
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <>
      {!showSidebar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white h-16 flex items-center justify-between px-6 shadow-md">
          {/* Left 2 Icons */}
          <div className="flex items-center gap-8">
            <div
              onClick={() => {
                setValue(0);
                navigate("/dashboard");
              }}
              className={`flex flex-col items-center text-xs cursor-pointer ${
                value === 0 ? "text-blue-600" : "text-black"
              }`}
            >
              <FaHome className="text-xl" />
              <span>Home</span>
            </div>
            <div
              onClick={() => {
                setValue(1);
                navigate("/with");
              }}
              className={`flex flex-col items-center text-xs cursor-pointer ${
                value === 1 ? "text-blue-600" : "text-black"
              }`}
            >
              <FaWallet className="text-xl" />
              <span>Wallet</span>
            </div>
          </div>

          {/* Center Floating + Button */}
          <button
            onClick={() => setShowSidebar(true)}
            className="absolute left-1/2 transform -translate-x-1/2 -top-4 bg-gray-300 text-blue-700 rounded-full shadow-lg w-12 h-12 flex items-center justify-center hover:bg-gray-100 z-50"
          >
            <FaPlusCircle className="text-2xl" />
          </button>

          {/* Right 2 Icons */}
          <div className="flex items-center gap-8">
            <div
              onClick={() => {
                setValue(3);
                navigate("/topup_data");
              }}
              className={`flex flex-col items-center text-xs cursor-pointer ${
                value === 3 ? "text-blue-600" : "text-black"
              }`}
            >
              <PixRounded className="text-xl" />
              <span>TopUp</span>
            </div>
            <div
              onClick={() => {
                setValue(4);
                navigate("/profile");
              }}
              className={`flex flex-col items-center text-xs cursor-pointer ${
                value === 4 ? "text-blue-600" : "text-black"
              }`}
            >
              <FaUser className="text-xl" />
              <span>Profile</span>
            </div>
          </div>
        </div>
      )}

      {showSidebar && (
        <div className="fixed inset-0 bg-white text-black z-50 w-full h-full overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/48.jpg"
                alt="Profile"
                className="rounded-full h-8"
              />
              <div>
                <p className="text-sm font-medium">User-5be6a</p>
                <p className="text-xs text-gray-600">ID: 1073345137</p>
              </div>
            </div>
            <button onClick={() => setShowSidebar(false)} className="text-xl">
              <ArrowRight />
            </button>
          </div>

          {/* Shortcut / Menu Items */}
          <div className="px-4 py-4 mt-1">
            <h3 className="text-sm text-gray-500 font-semibold mb-3">Income</h3>
            <div className="grid grid-cols-4 gap-4">
              {menuItems.slice(0, 4).map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleMenuClick(item.title, item.path, item.onClick)}
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div
                    className="p-3 rounded-full text-xl"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs text-center text-black font-medium">
                    {item.title.length > 12 ? item.title.slice(0, 10) + "..." : item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-4 mt-1">
            <h3 className="text-sm text-gray-500 font-semibold mb-3">Transactions</h3>
            <div className="grid grid-cols-4 gap-4">
              {menuItems.slice(4, 9).map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleMenuClick(item.title, item.path, item.onClick)}
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div
                    className="p-3 rounded-full text-xl"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs text-center text-black font-medium">
                    {item.title.length > 12 ? item.title.slice(0, 10) + "..." : item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-4 py-4 mt-1">
            <h3 className="text-sm text-gray-500 font-semibold mb-3">Team</h3>
            <div className="grid grid-cols-4 gap-4">
              {menuItems.slice(9,13).map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleMenuClick(item.title, item.path, item.onClick)}
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div
                    className="p-3 rounded-full text-xl"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs text-center text-black font-medium">
                    {item.title.length > 12 ? item.title.slice(0, 10) + "..." : item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Button */}
          <div className="px-4 py-6">
            <button className="w-full bg-black text-white py-2 rounded-md text-sm font-semibold">
              More Services
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNavigationBar;
