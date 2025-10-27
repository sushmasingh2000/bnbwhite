import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { apiConnectorGet, apiConnectorPost } from '../../utils/APIConnector';
import { endpoint } from '../../utils/APIRoutes';
import CustomTable from '../../Shared/CustomTable';
import CustomToPagination from '../../Shared/Pagination';
import { useFormik } from 'formik';
import moment from 'moment';

const Activation = () => {
  const [page, setPage] = useState(1)
  const client = useQueryClient();
  const initialValues = {
    search: '',
    pageSize: 10,
    start_date: '',
    end_date: '',
  };

  const fk = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,

  })
  const { data, isLoading } = useQuery(
    ['get_actiavtion', fk.values.search, fk.values.start_date, fk.values.end_date, page],
    () =>
      apiConnectorPost(endpoint?.topup_data, {
        search: fk.values.search,
        created_at: fk.values.start_date,
        updated_at: fk.values.end_date,
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
    <span> Amount ($)</span>,
    <span>INC Status</span>


  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span> {index + 1}</span>,
      <span>{moment?.utc(row.topup_date).format("DD-MM-YYYY HH:mm:ss")}</span>,
      <span>{row.topup_pack_amount}</span>,
      <span className={`${row.topup_roi_status === "INCOMPLETE" ? "text-green-500" : "text-rose-500"}`}>{row.topup_roi_status === "INCOMPLETE" ? "Continue" : row.topup_roi_status}</span>
    ];
  });
  return (
    <div className="rounded-lg shadow-lg p-3 border border-black/10 mb-6 bg-gray-200">
      <h2 className="text-xl font-semibold mb-4">Activation Report</h2>

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

      {/* Main Table Section */}
      <div className="rounded shadow border border-white/10  bg-gray-200">
        <CustomTable
          tablehead={tablehead}
          tablerow={tablerow}
          isLoading={isLoading}
        />
      </div>
      <CustomToPagination data={allData} setPage={setPage} page={page}/>
    </div>

  );
};

export default Activation;
