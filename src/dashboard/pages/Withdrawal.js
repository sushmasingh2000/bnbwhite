import React, { useState } from "react";
import { apiConnectorGet, apiConnectorPost } from "../../utils/APIConnector";
import { useQuery, useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { endpoint } from "../../utils/APIRoutes";
import { useFormik } from "formik";
import CustomTable from "../../Shared/CustomTable";
import moment from "moment";
import soment from "moment-timezone"
import CustomToPagination from "../../Shared/Pagination";

const Withdrawal = () => {
  const [amount, setAmount] = useState("");
  const [loding, setLoding] = useState(false);
  const client = useQueryClient();

  const initialValues = {
    with_amount: "",
  };
  const fk = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: () => {
      const reqbody = {
        with_amount: amount,
      };
      Withdarwal(reqbody);
    },
  });
  async function Withdarwal(reqbody) {
    setLoding(true);
    try {
      const res = await apiConnectorPost(
        endpoint?.add_user_withdrawal,
        reqbody
      );
      toast(res?.data?.message);
      fk.handleReset();
      client.refetchQueries("get_withdrawal");
      client.refetchQueries("get_profile");
    } catch (e) {
      console.log(e);
    }
    setLoding(false);
  }
  const [page, setPage] = useState(1);
  const initialValuesssss = {
    search: "",
    pageSize: 10,
    created_at: "",
    updated_at: "",
  };

  const formik = useFormik({
    initialValues: initialValuesssss,
    enableReinitialize: true,
  });
  const { data, isLoading } = useQuery(
    [
      "get_withdrawal",
      formik.values.search,
      formik.values.created_at,
      formik.values.updated_at,
      page,
    ],
    () =>
      apiConnectorPost(endpoint?.withdrawal_list, {
        search: formik.values.search,
        created_at: formik.values.created_at,
        updated_at: formik.values.updated_at,
        pageNumber: page,
        pageSize: "10",
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching direct data:", err),
    }
  );

  const allData = data?.data?.data || [];

  const tablehead = [
    <span>S.No.</span>,
    <span>Date</span>,
    <span>Transaction Id</span>,
    <span>Amount ($)</span>,
    <span>Wallet Address</span>,
    <span>Status</span>,
  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span> {index + 1}</span>,
      <span>
        {row?.wdrl_created_at
          ? soment(row?.wdrl_created_at)
            .tz("Asia/Kolkata")
            .format("DD-MM-YYYY HH:mm:ss")
          : "--"}
      </span>,
      <span>{row?.wdrl_transacton_id}</span>,
      <span> {row?.wdrl_amont || 0}</span>,
      <span>{row?.wdrl_to}</span>,
      <span>{row?.wdrl_status || "N/A"}</span>,
    ];
  });
  return (
    <>

      <div className="p-2">
        <div className="rounded-lg shadow-lg p-3 border border-black/10 mb-6 ">
          <h2 className="text-xl font-semibold mb-4">Payout  Report</h2>

           <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto p-2">
          {/* Start Date */}
          <div className="relative w-full sm:w-1/2">
            <input
              type="date"
              name="start_date"
              id="start_date"
              value={fk.values.start_date}
              onChange={fk.handleChange}
              className="w-full border-b border-gray-300 py-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none"
              placeholder="Start Date"
            />
            <label
              htmlFor="start_date"
              className="absolute left-0 -top-2.5 text-gray-600 font-bold text-xs transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-300 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-blue-500 peer-focus:text-xs"
            >
              Start Date
            </label>
          </div>

          {/* End Date */}
          <div className="relative w-full sm:w-1/2 mt-1">
            <input
              type="date"
              name="end_date"
              id="end_date"
              value={fk.values.end_date}
              onChange={fk.handleChange}
              className="w-full border-b border-gray-300 py-2 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none"
              placeholder="End Date"
            />
            <label
              htmlFor="end_date"
              className="absolute left-0 -top-2.5 text-gray-600 font-bold text-xs transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-300 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-blue-500 peer-focus:text-xs"
            >
              End Date
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 w-full mt-2 sm:mt-0 sm:w-auto">
            <button
              onClick={() => {
                setPage(1);
                client.invalidateQueries(["get_withdrawal"]);
              }}
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors text-sm"
            >
              Search
            </button>
            <button
              onClick={() => {
                fk.handleReset();
                setPage(1);
              }}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        </div>
        </div>

        {/* Main Table Section */}
        <div className="rounded shadow border border-white/10  bg-gray-200">
          <CustomTable
            tablehead={tablehead}
            tablerow={tablerow}
            isLoading={isLoading}
          />
        </div>
        <CustomToPagination data={allData} page={page} setPage={setPage}/>
      </div>
    </>
  );
};

export default Withdrawal;
