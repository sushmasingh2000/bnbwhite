import {
  ArrowRight
} from "@mui/icons-material";
import { useState } from "react";
import {
  FaCoins,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaNetworkWired,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCog,
  FaWallet
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/favicon.png";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
      color: "#3B82F6",
    }, // Blue
    {
      title: "Level Income",
      icon: <FaCoins />,
      path: "/income/level",
      color: "#F59E0B",
    }, // Amber
    {
      title: "ROI Income",
      icon: <FaCoins />,
      path: "/income/roi",
      color: "#10B981",
    }, // Green
    {
      title: "Upline Income",
      icon: <FaCoins />,
      path: "/income/direct",
      color: "#EF4444",
    }, // Red
    {
      title: "Reward Bonus",
      icon: <FaCoins />,
      path: "/income/reward",
      color: "#6366F1",
    }, // Indigo
    {
      title: "Activation",
      icon: <FaMoneyBillWave />,
      path: "/activation",
      color: "#EC4899",
    }, // Pink
    {
      title: "TopUp",
      icon: <FaMoneyBillWave />,
      path: "/topup_data",
      color: "#8B5CF6",
    }, // Violet
    {
      title: "Direct Team",
      icon: <FaNetworkWired />,
      path: "/referral",
      color: "#0EA5E9",
    }, // Sky Blue
    {
      title: "Downline Team",
      icon: <FaNetworkWired />,
      path: "/downline",
      color: "#14B8A6",
    }, // Teal
    {
      title: "Withdrawal",
      icon: <FaWallet />,
      path: "/with",
      color: "#EAB308",
    }, // Yellow
    {
      title: "Payout",
      icon: <FaExchangeAlt />,
      path: "/withdrawal",
      color: "#F97316",
    }, // Orange
    {
      title: "ClaimTopUp",
      icon: <FaExchangeAlt />,
      path: "/claim_topup",
      color: "#A855F7",
    }, // Purple
    {
      title: "Profile Settings",
      icon: <FaUserCog />,
      path: "/profile",
      color: "#6B7280",
    }, // Gray
    {
      title: "Logout",
      icon: <FaSignOutAlt />,
      color: "#DC2626", // Strong red
      onClick: () => {
        localStorage.clear();
        navigate("/");
      },
    },
  ];

  const handleMenuClick = (title, path, onClick) => {
    setActiveMenu(title);
    setShowSidebar(false);
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <>
      {/* === Mobile Top Bar === */}
      <div className="lg:hidden bg-white text-black px-4 py-3 flex justify-between items-center">
        <button
          className="text-xl font-semibold"
          // onClick={() => setShowSidebar(true)}
        >
           BNBChainX
        </button>
        <img
          src="https://randomuser.me/api/portraits/men/48.jpg"
          alt="Profile"
          className="rounded-full h-8"
        />
      </div>

      {/* === Mobile Sidebar === */}
      {showSidebar && (
        <div className="fixed inset-0 bg-white text-black z-50 w-full h-full overflow-y-auto mt-2">
          {/* Header */}
          <div className="flex justify-between items-center p-4 ">
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

          {/* Shortcut Section */}
          <div className="px-4 py-4 mt-5">
            <h3 className="text-sm text-gray-500 font-semibold mb-3">
              Support
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {menuItems?.slice(0, 8)?.map((item, i) => (
                <div
                  key={i}
                  onClick={() =>
                    handleMenuClick(item.title, item.path, item.onClick)
                  }
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div
                    className="p-3 rounded-full text-xl"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }} // Light background
                  >
                    {item.icon}
                  </div>

                  <span className="text-xs text-center text-black font-medium">
                    {item.title.length > 12
                      ? item.title.slice(0, 10) + "..."
                      : item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-4 mt-5">
            <h3 className="text-sm text-gray-500 font-semibold mb-3">
              Recommended
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {menuItems?.slice(8)?.map((item, i) => (
                <div
                  key={i}
                  onClick={() =>
                    handleMenuClick(item.title, item.path, item.onClick)
                  }
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <div
                    className="p-3 rounded-full text-xl"
                    style={{
                      backgroundColor: `${item.color}20`,
                      color: item.color,
                    }} // Light background
                  >
                    {item.icon}
                  </div>

                  <span className="text-xs text-center text-black font-medium">
                    {item.title.length > 12
                      ? item.title.slice(0, 10) + "..."
                      : item.title}
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

      {/* === Desktop Sidebar === */}
      <aside className="hidden lg:flex lg:w-64 bg-black text-white h-screen flex-col border-r border-gray-700">
        <div className="flex items-center justify-center p-4 border-b border-gray-700">
          <img src={logo} alt="Logo" className="w-28" />
        </div>

        <nav className="flex-1 overflow-y-auto p-4 text-sm space-y-1">
          {menuItems.map((item, i) => {
            const isActive = activeMenu === item.title;

            return (
              <div
                key={i}
                onClick={() =>
                  handleMenuClick(item.title, item.path, item.onClick)
                }
                className={`flex items-center gap-3 p-3 rounded cursor-pointer transition font-medium ${
                  isActive ? "bg-white text-black" : "hover:bg-gray-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.title}</span>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
