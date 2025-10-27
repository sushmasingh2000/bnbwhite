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
    <div className="min-h-screen bg-gray-200 py-1 px-4">
      <Loader isLoading={loding} />
      <p className="text-xl text-blue-900 font-bold py-2 text-center">Payout </p>
      <div className="max-w-md mx-auto bg-white rounded shadow-lg p-6">
        {/* Balance Info */}
        <div className="bg-blue-50 p-4 mb-5 rounded border border-blue-300">
          <div className="text-blue-600 text-sm font-semibold mb-1">
            Current Balance
          </div>
          <div className="text-blue-800 text-2xl font-bold">
            {user_profile?.jnr_curr_wallet ?? 0} USD
          </div>
        </div>

        {/* Wallet Address Display */}
        <div className="mb-5 text-sm bg-gray-100 text-gray-800 p-4 rounded border border-gray-300 break-words">
          <div className="font-medium text-blue-600 mb-1">Address:</div>
          <div className="font-semibold text-sm">
            {fk.values.walletAddress || "Not available"}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-5">
          <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            placeholder="Enter Amount"
            value={fk.values.amount}
            onChange={fk.handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
          />
        </div>

        {/* Wallet Address Input (read-only) */}
        <div className="mb-6">
          <label htmlFor="walletAddress" className="block text-gray-700 font-semibold mb-2">
            Confirm Wallet Address (BEP20)
          </label>
          <input
            id="walletAddress"
            name="walletAddress"
            readOnly
            placeholder="0x..."
            value={fk.values.walletAddress}
            className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Confirm Button */}
        <button
          onClick={Payout}
          className="w-full py-3 rounded-md bg-gradient-to-r from-blue-300 to-blue-900 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}


export default Payout;
