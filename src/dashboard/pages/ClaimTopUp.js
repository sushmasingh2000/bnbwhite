import React, { useState } from "react";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { apiConnectorPost } from "../../utils/APIConnector";
import { endpoint } from "../../utils/APIRoutes";
import { enCryptData } from "../../utils/Secret";
import Loader from "../../Shared/Loader";

const ClaimTopUp = () => {
  const [loding, setloding] = useState(false);

  const initialValue = {
    hash_number: "",
    req_amount: "",
  };

  const fk = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,
    onSubmit: () => {
      if (!fk.values.hash_number || !fk.values.req_amount) {
        return toast.error("Please enter all fields");
      }
      FundAdd(fk.values);
    },
  });

  async function FundAdd(reqBody) {
    const req = {
      hash_address: reqBody?.hash_number,
      req_amount: reqBody?.req_amount,
    };
    setloding(true);
    try {
      const res = await apiConnectorPost(endpoint.check_real_transaction, {
        payload: enCryptData(req),
      });

      Swal.fire({
        icon: res?.data?.success ? "success" : "error",
        title: res?.data?.success ? "Success" : "Error",
        text: res?.data?.msg || "Something happened",
      });

      if (res?.data?.success) {
        fk.handleReset();
      }
    } catch (e) {
      console.log(e);
    }
    setloding(false);
  }

  return (
    <>
      <Loader isLoading={loding} />
      <div className=" flex items-center justify-center bg-white text-black p-4">
        <div className="w-full max-w-xl bg-white border border-gray-200 rounded shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Claim TopUp</h2>

          <form className="space-y-5">
            <div>
              <label htmlFor="req_amount" className="block font-semibold mb-1">
                Amount
              </label>
              <input
                type="text"
                id="req_amount"
                name="req_amount"
                placeholder="Enter Amount"
                value={fk.values.req_amount}
                onChange={fk.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="hash_number" className="block font-semibold mb-1">
                Hash Address
              </label>
              <textarea
                id="hash_number"
                name="hash_number"
                rows="4"
                placeholder="Enter Hash Address"
                value={fk.values.hash_number}
                onChange={fk.handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                onClick={() => fk.handleReset()}
                variant="outlined"
                className="!border-red-500 !text-red-500 hover:!bg-red-100"
              >
                Clear
              </Button>
              <Button
                onClick={() => fk.handleSubmit()}
                variant="contained"
                className="!bg-black !text-white hover:!bg-gray-900"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ClaimTopUp;
