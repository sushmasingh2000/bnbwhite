import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Loader from "../../Shared/Loader";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";
import { enCryptData } from "../../utils/Secret";

function Payout() {
  // const [walletAddress, setWalletAddress] = useState("");
  const [data, setData] = useState("");
  const [loding, setLoding] = useState(false);
  const location = useLocation();

  const [userData, setUserData] = useState();

  // console.log(userData, "wghsfhdsxgqf");

  const params = new URLSearchParams(location?.search);
  const IdParam = params?.get("token");
  const base64String = atob(IdParam);
  const withdrawalType = location.state?.type;
  const fk = useFormik({
    initialValues: {
      amount: "",
      walletAddress: userData?.lgn_wallet_add || "",
    },
    enableReinitialize: true,
  });

  async function Payout() {
    const reqbody = {
      wallet_add: String(fk.values.walletAddress)?.trim(),
      amount: Number(fk.values.amount)?.toFixed(3),
      wallet_type:
        withdrawalType === "jackpot" ? 3 : withdrawalType === "wingo" ? 4 : 2,
    };

    setLoding(true);

    try {
      const res = await apiConnectorPost(
        endpoint?.withdrawal_api,
        {
          payload: enCryptData(reqbody),
        },
        base64String
      );
      setData(res?.data?.result?.[0]);
      Swal.fire({
        title:
          String(res?.data?.success) === "true"
            ? "🎉 Congratulations!"
            : "Error!",
        html:
          String(res?.data?.success) === "true"
            ? `
            <p style="font-size:14px; margin-bottom:8px;">${res?.data?.message}</p>
          `
            : `<p style="font-size:14px; margin-bottom:8px;">${res?.data?.message}</p>`,
        icon: String(res?.data?.success) === "true" ? "success" : "error",
        confirmButtonColor: "#75edf2",
      });
      fk.handleReset();
      if (String(res?.data?.success) === "true") {
        GetWalletUserData();
      }
    } catch (e) {
      console.log(e);
    }
    setLoding(false);
  }

  async function GetWalletUserData() {
    setLoding(true);
    try {
      const res = await apiConnectorGet(
        endpoint?.wallet_user_data,
        {},
        base64String
      );
      setUserData(res?.data?.result?.[0]);
      // toast(res?.data?.message);
    } catch (e) {
      console.log(e);
    }
    setLoding(false);
  }

  useEffect(() => {
    GetWalletUserData();
  }, []);

  // const { data: profile_data } = useQuery(
  //   ["profile_api"],
  //   () => apiConnectorGetWithoutToken(endpoint?.profile_api,{},base64String),
  //   {
  //     refetchOnMount: false,
  //     refetchOnReconnect: false,
  //     retry: false,
  //     retryOnMount: false,
  //     refetchOnWindowFocus: false,
  //   }
  // );
  // const profile = profile_data?.data?.result || [];
  // console.log(userData);

  const { data: profile, refetch: refetchProfile } = useQuery(
    // Added refetch
    ["get_profile"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const user_profile = profile?.data?.result?.[0] || [];

  return (
    <div className=" flex items-center justify-center  px-2">
      <Loader isLoading={loding} />

      <div className="w-full max-w-md bg-white/80 shadow-xl rounded-xl p-6 border border-white ">
        <h1 className="text-2xl font-extrabold text-center text-blue-800 mb-6">
          💸 Payout
        </h1>

        {/* ====== Redesigned Balance Card ====== */}
        <div className="relative">
          <div className="bg-white border border-blue-200 rounded-xl shadow-md p-2 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 to-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-md mb-1">
              💰
            </div>
            <p className="text-gray-600 text-sm font-semibold">Current Balance</p>
            <p className="text-4xl font-extrabold text-blue-800 mt-1">
              {user_profile?.jnr_curr_wallet ?? 0}
              <span className="text-lg font-semibold text-blue-500 ml-1">USD</span>
            </p>
          </div>

          {/* Decorative gradient ring */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-200 to-indigo-200 blur-2xl rounded-2xl opacity-40"></div>
        </div>

        {/* ====== Wallet Address Display ====== */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4  mt-4">
          <p className="text-gray-600 text-sm font-semibold mb-1">Wallet Address:</p>
          <p className="text-green-600 font-bold break-all text-sm">
            {fk.values.walletAddress || "Not available"}
          </p>
        </div>

        {/* ====== Amount Input ====== */}
        <div className="mb-5 mt-3">
          <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">
            Enter Amount
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="e.g. 50"
              value={fk.values.amount}
              onChange={fk.handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 transition-all"
            />
            <span className="absolute right-3 top-3 text-gray-500 font-semibold">USD</span>
          </div>
        </div>

        {/* ====== Wallet Address (read-only) ====== */}
        {/* <div className="mb-6">
      <label htmlFor="walletAddress" className="block text-gray-700 font-semibold mb-2">
        Confirm Wallet Address (BEP20)
      </label>
      <input
        id="walletAddress"
        name="walletAddress"
        readOnly
        placeholder="0x..."
        value={fk.values.walletAddress}
        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-not-allowed"
      />
         </div> */}

        {/* ====== Confirm Button ====== */}
        <button
          onClick={Payout}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-800 hover:from-blue-600 hover:to-blue-900 text-white font-semibold shadow-md transition-all transform hover:scale-[1.02]"
        >
          Confirm Payout
        </button>
      </div>
    </div>


  );
}


export default Payout;
