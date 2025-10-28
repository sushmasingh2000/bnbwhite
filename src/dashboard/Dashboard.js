import copy from "copy-to-clipboard";
import moment from "moment";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import Loader from "../Shared/Loader";
import { apiConnectorGet } from "../utils/APIConnector";
import { endpoint, frontend, support_mail } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import { Mail } from "@mui/icons-material";
import BottomNav from "./pages/Layout/BottomNav";
import {
  FaDollarSign,
  FaLink,
  FaRocket,
} from "react-icons/fa";
import {
  MdLeaderboard,
  MdAttachMoney,
  MdGroups,
  MdTrendingUp,
} from "react-icons/md";
import { RiRocketLine, RiWallet3Line } from "react-icons/ri";

const Dashboard = () => {
  const { data: dashboard_Api, isLoading } = useQuery(
    ["dashboard_api"],
    () => apiConnectorGet(endpoint?.user_dashboard_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const dashboard = dashboard_Api?.data?.result?.[0] || [];

  const { data: profile_data, isLoading: profileloading } = useQuery(
    ["profile_api"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  const user_profile = profile_data?.data?.result?.[0] || [];

  const Row = ({
    label,
    value,
    highlight = false,
    color = "text-yellow-400",
  }) => (
    <div className="flex justify-between pb-1">
      <span className="">{label}</span>
      <span className={highlight ? `${color} font-semibold` : ""}>
        {value}
      </span>
    </div>
  );


  const statCards = [
    {
      path: "#",
      title: "Main Wallet",
      value: `$ ${Number(user_profile?.jnr_curr_wallet || 0).toFixed(2)}`,
      icon: <RiWallet3Line className="text-yellow-500" />,
      color: "text-yellow-600",
    },
    {
      path: "/activation",
      title: "Fund Wallet",
      value: `$ ${Number(user_profile?.topup_amount || 0).toFixed(2)}`,
      icon: <MdAttachMoney className="text-green-500" />,
      color: "text-green-600",
    },
    {
      path: "/income/direct",
      title: "Upline Income",
      value: `$ ${Number(dashboard?.direct || 0).toFixed(2)}`,
      icon: <MdGroups className="text-red-500" />,
      color: "text-red-600",
    },
    {
      path: "/income/level",
      title: "Level Income",
      value: `$ ${Number(dashboard?.level || 0).toFixed(2)}`,
      icon: <MdLeaderboard className="text-orange-500" />,
      color: "text-orange-600",
    },
    {
      title: "Booster Income",
      value: `$ ${Number(dashboard?.booster_income || 0).toFixed(2)}`,
      icon: <FaRocket className="text-purple-500" />,
      color: "text-purple-600",
    },
    {
      title: "Rank Income",
      value: `$ ${Number(dashboard?.rank_income || 0).toFixed(2)}`,
      icon: <MdTrendingUp className="text-blue-500" />,
      color: "text-blue-600",
    },
    {
      path: "/income/roi",
      title: "ROI Income",
      value: `$ ${Number(dashboard?.roi_income || 0).toFixed(2)}`,
      icon: <RiRocketLine className="text-teal-500" />,
      color: "text-teal-600",
    },
    {
      path: "/income/reward",
      title: "Reward Bonus",
      value: `$ ${Number(dashboard?.reward_bonus || 0).toFixed(2)}`,
      icon: <RiRocketLine className="text-pink-500" />,
      color: "text-pink-600",
    },
    {
      path: "#",
      title: "Total Income",
      value: `$ ${Number(user_profile?.total_income || 0).toFixed(2)}`,
      icon: <FaDollarSign className="text-yellow-700" />,
      color: "text-yellow-700",
    },
  ];


  const functionTOCopy = (value) => {
    copy(value);
    toast.success("Copied to clipboard!", { id: 1 });
  };

  const navigate = useNavigate();

  return (
    <div className="lg:flex h-screen font-sans ">
      <Loader isLoading={isLoading || profileloading} />
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
      <main className="flex-1 overflow-y-auto max-h-screen example">
        <div className="flex flex-wrap gap-4 lg:p-6 py-6 " >
          <div className="w-full md:w-[calc(50%-0.5rem)]  p-4 rounded shadow-xl bg-gold-color">
            <Row label="Wallet Address " highlight />

            <p className="blue pb-1 text-[10px] text-blue-color">
              {user_profile?.lgn_email}
            </p>
            <Row
              label="Subscriber Id"
              value={user_profile?.lgn_cust_id || "--"}
              highlight
              color="blue"
            />
            <Row
              label="Activation Date"
              value={
                user_profile?.topup_date
                  ? moment(user_profile?.topup_date)?.format("DD-MM-YYYY")
                  : "--"
              }
              highlight
              color="blue"
            />
            <Row
              label="TopUp Amount"
              value={user_profile?.topup_amount || "--"}
              highlight
              color="blue"
            />
          </div>
          <div className="w-full md:w-[calc(50%-0.5rem)]  p-4 py-6 rounded shadow-xl bg-gold-color">
            <h2 className="font-bold mb-2 flex items-center gap-2">
              <FaLink /> [ Rank Participant ] Referral Link
            </h2>
            <div className="flex items-center justify-between  p-2 rounded">
              <span className="text-sm  overflow-x-auto">
                {frontend + `/register?startapp=${user_profile?.lgn_cust_id}`}
              </span>

              <button
                onClick={() =>
                  functionTOCopy(
                    frontend + "/register?startapp=" + user_profile?.lgn_cust_id
                  )
                }
                className="bg-dark-color text-white px-2 py-1 rounded text-sm"
              >
                Copy
              </button>
            </div>
            <div className="flex space-x-4 mt-3 text-sm items-center">
              <Mail onClick={() => functionTOCopy(support_mail)} />{" "}
              <span className="!text-[11px]" onClick={() => functionTOCopy(support_mail)}>{support_mail}</span>
              {/* <i className="fab fa-mail"></i>
              <i className="fab fa-telegram"></i>
              <i className="fab fa-facebook"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i> */}
            </div>
          </div>


        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:px-6 pb-6">
          {statCards.map((card, i) => (
            <div
              key={i}
              className="bg-gold-color text-black py-8 px-4 border rounded-xl border-gray-300 shadow-xs gap-2 flex items-center justify-between cursor-pointer"
              onClick={() => navigate(card?.path)}
            >
              <div className="flex gap-1 items-center">
                <div className="text-3xl">{card.icon}</div>

                <div className={`text-sm font-semibold ${card.color}`}>
                  {card.title}
                </div>
              </div>
              <div>
                <div className="text-xl font-bold">{card.value}</div>
              </div>
            </div>
          ))}

        </div>
        <div className="flex items-center justify-between">
          {/* <Account /> */}
          {/* <CappingPieChart/> */}
        </div>
      </main>
      <BottomNav />
      
    </div>
  );
};

export default Dashboard;
