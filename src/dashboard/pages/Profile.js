import React, { useState } from "react";
import { endpoint } from "../../utils/APIRoutes";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import bit from "../../assets/favicon.png";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import moment from "moment";
import Swal from "sweetalert2";

const Profile = () => {
  const [loding, setLoding] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { data: profile, refetch: refetchProfile } = useQuery(
    ["get_profile"],
    () => apiConnectorGet(endpoint?.profile_api),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const user_profile = profile?.data?.result?.[0] || []; // Changed to empty object for safer access

  // Formik for Wallet Address
  const fkWallet = useFormik({
    // Renamed from fk to fkWallet
    initialValues: {
      wallet_address: user_profile?.wallet_Address || "",
    },
    enableReinitialize: true,
    onSubmit: () => {
      const reqbody = {
        wallet_address: fkWallet.values.wallet_address,
      };
      WalletFn(reqbody);
    },
  });

  async function WalletFn(reqbody) {
    setLoding(true);
    try {
      const res = await apiConnectorPost(endpoint?.add_wallet_address, reqbody);
      toast.success(res?.data?.message); // Changed to toast.success
      if (res?.data?.message === "Wallet Add Successfully") {
        setShowWalletModal(false);
        refetchProfile(); // Refetch profile to update wallet address
      }
      fkWallet.handleReset();
    } catch (e) {
      console.error(e); // Changed to console.error
      toast.error(
        e?.response?.data?.message || "Failed to update wallet address"
      ); // Display error message
    }
    setLoding(false);
  }

  // Formik for Update Password
  const fkPassword = useFormik({
    // Renamed from formik to fkPassword
    initialValues: {
      oldPass: "",
      newPass: "",
    },
    enableReinitialize: true,
    onSubmit: () => {
      const reqbody = {
        oldPass: fkPassword.values.oldPass,
        newPass: fkPassword.values.newPass,
      };
      UpdatePasswordFn(reqbody);
    },
  });

  async function UpdatePasswordFn(reqbody) {
    setLoding(true);
    try {
      const res = await apiConnectorPost(
        endpoint?.update_user_password,
        reqbody
      );
      toast.success(res?.data?.message);
      if (res?.data?.message === "Password Update Successfully") {
        setShowPasswordModal(false);
      }
      fkPassword.handleReset();
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message);
    }
    setLoding(false);
  }

  const fkProfile = useFormik({
    initialValues: {
      name: user_profile?.Associate_Name || "",
      email: user_profile?.Email || "",
      mobile: user_profile?.Mobile_No || "",
      wallet_address: user_profile?.wallet_Address || "",
    },
    enableReinitialize: true,
    onSubmit: () => {
      const reqbody = {
        lgn_real_mob: fkProfile.values.mobile,
        lgn_real_email: "test@gmail.com",
        lgn_real_name: fkProfile.values.name,
        lgn_wallet_add: "xxxxxxxxxxxxxxxx",
      };
      UpdateProfileFn(reqbody);
    },
  });

  async function UpdateProfileFn(reqbody) {
    setLoding(true);
    try {
      const res = await apiConnectorPost(
        endpoint?.update_user_profile,
        reqbody
      );
      // toast.success(res?.data?.message);
      Swal.fire({
        title:
          String(res?.data?.success) === "true"
            ? "🎉 Congratulations!"
            : "Error!",
        text: res?.data?.message,
        icon: String(res?.data?.success) === "true" ? "success" : "error",
        confirmButtonColor: "#75edf2",
      });
      if (res?.data?.success) {
        setShowProfileModal(false);
        refetchProfile();
      }
      fkProfile.handleReset();
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to update profile.");
    }
    setLoding(false);
  }

  return (
    <>
      <div className="bg-white rounded-xl lg:mt-8 text-black p-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 grid-cols-1 gap-8">
          {/* General Info Box */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-black/10">
            <div className="flex flex-col items-center mb-6">
              {/* <img src={bit} alt="Coin Icon" className="w-32 mb-3" /> */}
              <p className="text-xl font-semibold mb-4"> BNBChainX</p>
              <h2 className="text-lg font-semibold text-blue-700">
                General Account Information
              </h2>
            </div>

            <div className="space-y-3 text-sm text-black">
              <div className="flex justify-between py-2 border-b border-black/10">
                <span>Registration Date:</span>
                <span className="font-medium">
                  {moment(user_profile?.jnr_created_at)?.format("DD-MM-YYYY") || "--"}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-black/10">
                <span>Activation Date:</span>
                <span className="font-medium">
                  {user_profile?.jnr_topup_date
                    ? moment(user_profile?.jnr_topup_date)?.format("DD-MM-YYYY")
                    : "--"}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-black/10">
                <span>Name:</span>
                <span className="font-medium">
                  {user_profile?.lgn_real_name || "--"}
                </span>
              </div>

              <div className="flex flex-col justify-between py-2 border-b border-black/10">
                <span>Wallet Address:</span>
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent text-xs font-mono">
                  {user_profile?.lgn_mobile || "--"}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-black/10">
                <span>Subscriber ID:</span>
                <span className="font-medium">
                  {user_profile?.lgn_cust_id || "--"}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Edit Box */}
          {user_profile?.lgn_update_prof === "Active" && (
            <div className="bg-white p-4 rounded-lg shadow-md border border-black/10 h-fit">
              <div className="flex flex-col items-center mb-6">
                <p className="text-xl font-semibold mb-4"> BNBChainX</p>
                <h2 className="text-lg font-semibold text-blue-700">
                  Subscriber Profile Setting
                </h2>
              </div>

              {["Update Profile"].map((label, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center py-2 ${index < 2 ? "border-b border-black/10" : ""
                    }`}
                >
                  <span className="text-black">{label}:</span>
                  <button
                    onClick={() => {
                      if (label === "Update Profile") setShowProfileModal(true);
                    }}
                    className="bg-black hover:bg-blue-800 text-white font-semibold py-1.5 px-4 rounded text-xs transition"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Wallet Address Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-white text-lg font-semibold mb-4">
              {fkWallet.values.wallet_address
                ? "Update Wallet Address"
                : "Add Wallet Address"}
            </h3>
            <form onSubmit={fkWallet.handleSubmit}>
              <input
                type="text"
                name="wallet_address"
                placeholder="Enter wallet address"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={fkWallet.values.wallet_address}
                onChange={fkWallet.handleChange}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                  onClick={() => {
                    setShowWalletModal(false);
                    fkWallet.handleReset();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gold-color text-gray-900 font-semibold rounded hover:bg-gold-color"
                  disabled={loding}
                >
                  {loding ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-white text-lg font-semibold mb-4">
              Change Password
            </h3>
            <form onSubmit={fkPassword.handleSubmit}>
              <input
                type="password" // Changed to password type
                name="oldPass"
                id="oldPass"
                placeholder="Enter Old Password"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={fkPassword.values.oldPass}
                onChange={fkPassword.handleChange}
              />
              <input
                type="password" // Changed to password type
                name="newPass"
                id="newPass"
                placeholder="Enter New Password"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={fkPassword.values.newPass}
                onChange={fkPassword.handleChange}
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                  onClick={() => {
                    setShowPasswordModal(false);
                    fkPassword.handleReset();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-gray-900 font-semibold rounded hover:bg-gold-color"
                  disabled={loding}
                >
                  {loding ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Profile Modal (New) */}
      {showProfileModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative text-gray-100">
            {" "}
            {/* Adjusted background and width */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Update Profile
              </h3>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  setShowProfileModal(false);
                  fkProfile.handleReset();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={fkProfile.handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={fkProfile.values.name}
                  onChange={fkProfile.handleChange}
                />
              </div>
              {/* <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={fkProfile.values.email}
                                    onChange={fkProfile.handleChange}
                                />
                            </div> */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={"India +91"}
                  />
                </div> */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Mobile <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    id="mobile"
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={fkProfile.values.mobile}
                    onChange={fkProfile.handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 rounded-md font-semibold bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                  onClick={() => {
                    setShowProfileModal(false);
                    fkProfile.handleReset();
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md font-semibold bg-green-500 text-gray-900 hover:bg-gold-color transition-colors"
                  disabled={loding}
                >
                  {loding ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
