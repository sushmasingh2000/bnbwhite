import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { apiConnectorPost } from "../../../utils/APIConnector";
import { endpoint } from "../../../utils/APIRoutes";
import CustomToPagination from "../../../Shared/Pagination";
import { useFormik } from "formik";
import CustomTable from "../../Shared/CustomTable";
import moment from "moment";
import { Radio, RadioGroup } from "@mui/material";
import toast from "react-hot-toast";
import { enCryptData } from "../../../utils/Secret";
const Level = () => {
  const [page, setPage] = useState(1);
  const [loding, setLoding] = useState(false);
  const client = useQueryClient();
  const initialValues = {
    income_Type: "",
    search: "",
    pageSize: 10,
    start_date: "",
    end_date: "",
  };

  const fk = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
  });
  const { data, isLoading,refetch } = useQuery(
    [
      `get_topup_admin${page}`,
      fk.values.search,
      fk.values.start_date,
      fk.values.end_date,
      page,
    ],
    () =>
      apiConnectorPost(endpoint?.get_topup_api, {
        search: fk.values.search,
        start_date: fk.values.start_date,
        end_date: fk.values.end_date,
        page: page,
        count: "10",
      }),
    {
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onError: (err) => console.error("Error fetching level data:", err),
    }
  );

  const allData = data?.data?.data || [];

  async function handleTOpupStatus(lid,id, value) {
    setLoding(true)
    try {
      const body = {
        lid:lid,
        user_id: id,
        value: value,
      };
      await apiConnectorPost(endpoint.change_topup_status, {
        payload: enCryptData(body),
      });
      refetch()
    } catch (e) {
      toast(e?.message);
    }
    setLoding(false)
  }
  const tablehead = [
    <span>S.No.</span>,
    <span>Date</span>,
    <span>User ID</span>,
    <span>Topup By</span>,
    <span> Amount ($)</span>,
    <span>Wallet Address</span>,
    <span>Description</span>,
  ];

  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span> {index + 1}</span>,
      <span>
        {moment?.(row.ledger_created_at).format("DD-MM-YYYY HH:mm:ss")}
      </span>,
      <span>{row.lgn_cust_id}</span>,
      <span>
        <RadioGroup
          value={row.ledger_topup_by === "gateway" ? "gateway" : "admin"}
          onChange={(e) =>
            handleTOpupStatus(row.ledger_id,row.ledger_tr_middle_id, e.target.value)
          }
        >
          <span>
            <Radio value="gateway" label="Gateway" /> Gateway
          </span>
          <span>
            <Radio value="admin" label="Admin" /> Admin
          </span>
        </RadioGroup>
      </span>,
      <span>{row.ledger_amount}</span>,
      <span> {row.lgn_mobile}</span>,
      <span> {row.ledger_des}</span>,
    ];
  });
  return (
    <div className="p-2">
      <div className="bg-white bg-opacity-50 rounded-lg shadow-lg p-3 text-white mb-6">
        <div className="flex flex-col sm:flex-wrap md:flex-row items-center gap-3 sm:gap-4 w-full text-sm sm:text-base">
          <input
            type="date"
            name="start_date"
            id="start_date"
            value={fk.values.start_date}
            onChange={fk.handleChange}
            className="bg-white bg-opacity-50 border border-gray-600 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
          />
          <input
            type="date"
            name="end_date"
            id="end_date"
            value={fk.values.end_date}
            onChange={fk.handleChange}
            className="bg-white bg-opacity-50 border border-gray-600 rounded-md py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
          />
          <input
            type="text"
            name="search"
            id="search"
            value={fk.values.search}
            onChange={fk.handleChange}
            placeholder="User ID"
            className="bg-white bg-opacity-50 border border-gray-600 rounded-full py-2 px-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto text-sm"
          />
          <button
            onClick={() => {
              setPage(1);
              client.invalidateQueries(["get_topup_admin"]);
            }}
            type="submit"
            className="bg-blue-500 text-gray-900 font-bold py-2 px-4 rounded-full hover:bg-dark-color transition-colors w-full sm:w-auto text-sm"
          >
            Search
          </button>
          <button
            onClick={() => {
              fk.handleReset();
              setPage(1);
            }}
            className="bg-gray-color text-gray-900 font-bold py-2 px-4 rounded-full hover:bg-black hover:text-white transition-colors w-full sm:w-auto text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Main Table Section */}

      <CustomTable
        tablehead={tablehead}
        tablerow={tablerow}
        isLoading={isLoading||loding}
      />

      {/* Pagination */}
      <CustomToPagination page={page} setPage={setPage} data={allData} />
    </div>
  );
};

export default Level;
