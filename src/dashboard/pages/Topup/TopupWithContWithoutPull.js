import { Box } from "@mui/material";
import { ethers } from "ethers";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loader from "../../../Shared/Loader";
import { apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import { enCryptData } from "../../../utils/Secret";
const tokenABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function deposit(uint256 usdtAmount, uint256 fstAmount) external",
  "function burnToken(address token, address user, uint256 amount) external",
  "function checkAllowance(address token, address user) external view returns (uint256)",
  "event Deposited(address indexed user, uint256 usdtAmount, uint256 fstAmount)",
  "event TokenBurned(address indexed user, uint256 amount)",
];

function TopupWithContWithoutPull() {
  const [walletAddress, setWalletAddress] = useState("");
  const [no_of_Tokne, setno_of_Tokne] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [receiptStatus, setReceiptStatus] = useState("");
  const [bnb, setBnb] = useState("");

  const [loding, setLoding] = useState(false);
  const fk = useFormik({
    initialValues: {
      inr_value: "",
    },
  });
  async function requestAccount() {
    setLoding(true);

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }], // Chain ID for Binance Smart Chain Mainnet
        });
        const userAccount = accounts[0];
        setWalletAddress(userAccount);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const nativeBalance = await provider.getBalance(userAccount);
        setBnb(ethers.utils.formatEther(nativeBalance));
        const tokenContract = new ethers.Contract(
          "0x55d398326f99059fF775485246999027B3197955",
          tokenABI,
          provider
        );
        const tokenBalance = await tokenContract.balanceOf(userAccount);
        setno_of_Tokne(ethers.utils.formatUnits(tokenBalance, 18));
      } catch (error) {
        console.log(error);
        toast("Error connecting...", error);
      }
    } else {
      toast("Wallet not detected.");
    }
    setLoding(false);
  }

  async function sendTokenTransaction() {
    if (!window.ethereum) return toast("MetaMask not detected");
    if (!walletAddress) return toast("Please connect your wallet.");

    const usdAmount = Number(fk.values.inr_value || 0);
    if (usdAmount < 5) {
      Swal.fire({
        title: "Error!",
        text: "Please Enter an amount above or equal to $5.",
        icon: "error",
        confirmButtonColor: "#75edf2",
      });
      return;
    }

    try {
      setLoding(true);

      // ✅ Switch to BSC Mainnet
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      // ✅ Get latest BNB price
      async function getBNBPriceInUSDT() {
        try {
          const response = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
          );
          const data = await response.json();
          if (data?.binancecoin?.usd) return data.binancecoin.usd;
        } catch { }
        const response = await fetch(
          "https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT"
        );
        const data = await response.json();
        return parseFloat(data.price);
      }

      const bnbPrice = await getBNBPriceInUSDT();
      const bnbAmount = usdAmount / bnbPrice;

      const dummyData = await PayinZpDummy(bnbPrice);
      if (!dummyData?.success || !dummyData?.last_id) {
        setLoding(false);
        Swal.fire({
          title: "Error!",
          text: dummyData?.message || "Server error",
          icon: "error",
          confirmButtonColor: "#75edf2",
        });
        return;
      }
      const last_id = Number(dummyData.last_id);

      // ✅ Convert to BigNumber
      const bnbValue = ethers.utils.parseEther(bnbAmount.toFixed(8));

      // ✅ Contract (new address)
      const mainContract = new ethers.Contract(
        "0x2781df622dc9b4143b2420514b7f79ebde218468", // your deployed contract
        ["function deposit() external payable"],
        signer
      );

      // 🔍 Balance Check
      const bnbBalance = await provider.getBalance(userAddress);
      if (bnbBalance.lt(bnbValue)) {
        setLoding(false);
        Swal.fire({
          title: "Error!",
          text: "⚠️ Sorry, your account does not have sufficient balance to complete this payment.",
          icon: "error",
          confirmButtonColor: "#75edf2",
        });
        return;
      }

      // ⛽ Estimate Gas
      const gasEstimate = await mainContract.estimateGas.deposit({
        value: bnbValue,
      });
      const gasPrice = await provider.getGasPrice();
      const gasCost = gasEstimate.mul(gasPrice);

      if (bnbBalance.lt(gasCost.add(bnbValue))) {
        setLoding(false);
        Swal.fire({
          title: "Error!",
          text: `Not enough BNB for gas. Need ~${ethers.utils.formatEther(
            gasCost
          )} extra BNB`,
          icon: "error",
          confirmButtonColor: "#75edf2",
        });
        return;
      }

      // 🚀 Send Deposit Transaction
      const tx = await mainContract.deposit({ value: bnbValue });
      const receipt = await tx.wait();

      setTransactionHash(tx.hash);
      setReceiptStatus(receipt.status === 1 ? "Success" : "Failure");

      await PayinZp(bnbPrice, tx.hash, receipt.status === 1 ? 2 : 3, last_id);

      if (receipt.status === 1) {
        Swal.fire({
          title: "Congratulations!",
          text: "🎉 Your payment has been initiated successfully, and your account has been topped up.",
          icon: "success",
          confirmButtonColor: "#75edf2",
        });
      } else {
        toast("Transaction failed!");
      }
    } catch (error) {
      console.error(error);
      if (error?.data?.message) toast(error.data.message);
      else if (error?.reason) toast(error.reason);
      else toast("BNB transaction failed.");
    } finally {
      setLoding(false);
    }
  }

  async function PayinZp(bnbPrice, tr_hash, status, id) {
    setLoding(true);

    const reqbody = {
      req_amount: fk.values.inr_value,
      u_user_wallet_address: walletAddress,
      u_transaction_hash: tr_hash,
      u_trans_status: status,
      currentBNB: 0,
      currentZP: no_of_Tokne,
      gas_price: bnbPrice,
      pkg_id: "1",
      last_id: id,
    };
    try {
      await apiConnectorPost(
        endpoint?.paying_api,
        {
          payload: enCryptData(reqbody),
        }
        // base64String
      );
      // toast(res?.data?.message);
      fk.handleReset();
    } catch (e) {
      console.log(e);
    }
    setLoding(false);
  }

  async function PayinZpDummy(bnbPrice) {
    const reqbody = {
      req_amount: fk.values.inr_value,
      u_user_wallet_address: walletAddress,
      u_transaction_hash: "xxxxxxxxxx",
      u_trans_status: 1,
      currentBNB: 0,
      currentZP: no_of_Tokne,
      gas_price: bnbPrice,
      pkg_id: "1",
      deposit_type: "Mlm",
    };

    try {
      const res = await apiConnectorPost(
        endpoint?.paying_dummy_api,
        {
          payload: enCryptData(reqbody),
        }
        // base64String
      );
      return res?.data || {};
    } catch (e) {
      console.log(e);
      console.log(e);
    }
  }

  return (
    <>
      <Loader isLoading={loding} />
      <p className="text-2xl text-blue-900 font-bold py-4 text-center">TopUp</p>
      <div className=" bg-gray-200 flex items-center justify-center">

        <Box className="w-full max-w-xl bg-white p-8 rounded shadow-lg">
          <button
            onClick={requestAccount}
            className="w-full mb-8 py-2 rounded bg-blue-900 hover:bg-blue-700 text-white font-semibold transition"
          >
            Connect With DApp
          </button>

          {walletAddress && (
            <div className="mb-8 p-6 border border-blue-400 rounded text-center">
              <p className="text-blue-600 font-semibold mb-3">Associated Wallet</p>
              <p className="break-all text-black font-mono text-lg">
                {walletAddress.substring(0, 10)}...{walletAddress.substring(walletAddress.length - 10)}
              </p>
            </div>
          )}

          <div className="mb-8 flex flex-col">
            <label>Enter Amount</label>
            <input
              placeholder="Enter TopUp Amount"
              id="inr_value"
              name="inr_value"
              value={fk.values.inr_value}
              onChange={fk.handleChange}
              className="w-full p-4 text-black text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              min="0"
            />
          </div>

          <button
            onClick={sendTokenTransaction}
            className="w-full py-4 rounded-md bg-black  hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition text-lg"
          >
            Pay Now
          </button>

          {transactionHash && (
            <div className="mt-8 p-6 border border-blue-400 rounded text-sm text-black font-mono break-words">
              <p className="mb-3 font-semibold text-blue-600 text-lg">Transaction Hash:</p>
              <p>{transactionHash}</p>

              <div className="mt-6 flex justify-between text-base">
                <span className="text-blue-600 font-semibold">Transaction Status:</span>
                <span>{receiptStatus}</span>
              </div>
            </div>
          )}
        </Box>
      </div>
    </>
  );
}
export default TopupWithContWithoutPull;
