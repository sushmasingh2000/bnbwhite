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
  console.log(formik.values)
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
        <div className="rounded-lg shadow-lg p-3 border border-black/10 mb-6 bg-gray-200">
          <h2 className="text-xl font-semibold mb-4">Payout  Report</h2>

          <div className="flex flex-col sm:flex-wrap md:flex-row items-center gap-3 sm:gap-4 w-full text-sm sm:text-base">
          <div className="relative w-full sm:w-auto">
          {fk.values.start_date ? "" :
              <label
              htmlFor="start_date"
              className="absolute left-3 top-2 text-white text-sm"
            >
              Start Date
            </label>
            }
            <input
              type="date"
              name="start_date"
              id="start_date"
              value={fk.values.start_date}
              onChange={fk.handleChange}
              className="bg-black border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 w-full sm:w-auto text-sm"
            />
          </div>
          <div className="relative w-full sm:w-auto">
          {fk.values.end_date ? "" :
              <label
              htmlFor="end_date"
              className="absolute left-3 top-2 text-white text-sm"
            >
              End Date
            </label>
            }
            <input
              type="date"
              name="end_date"
              id="end_date"
              value={fk.values.end_date}
              onChange={fk.handleChange}
              className="bg-black border border-white/20 rounded-md py-2 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 w-full sm:w-auto text-sm"
            />
          </div>
          <button
            onClick={() => {
              setPage(1);
              client.invalidateQueries(["get_roi"]);
            }}
            type="submit"
            className="bg-white text-blue-900 font-bold py-2 px-4 rounded-full hover:bg-gray-300 transition-colors w-full sm:w-auto text-sm"
          >
            Search
          </button>
          <button
            onClick={() => {
              fk.handleReset();
              setPage(1);
            }}
            className="bg-transparent border border-white text-black font-bold py-2 px-4 rounded-full hover:bg-white hover:text-black transition-colors w-full sm:w-auto text-sm"
          >
            Clear
          </button>
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
