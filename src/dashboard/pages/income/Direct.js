import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { apiConnectorGet, apiConnectorPost } from '../../../utils/APIConnector';
import { endpoint } from '../../../utils/APIRoutes';
import CustomTable from '../../../Shared/CustomTable';
import CustomToPagination from '../../../Shared/Pagination';
import { useFormik } from 'formik';
import moment from 'moment';

const Direct = () => {
  const [page, setPage] = useState(1)
  const client = useQueryClient();
  const initialValues = {
    income_Type: "",
    search: '',
    page: "",
    start_date: '',
    end_date: '',
  };

  const fk = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,

  })
  const { isLoading, data } = useQuery(
    ["direct_income_api", page],
    () =>
      apiConnectorGet(
`        ${endpoint?.roi_income_api}?income_type=DIRECT&page=${page}`
      ),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const allData = data?.data?.data || [];

  const tablehead = [
    <span>S.No.</span>,
    <span>Date</span>,
    <span>Amount ($)</span>,
    <span>Description</span>,


  ];
  const tablerow = allData?.data?.map((row, index) => {
    return [
      <span> {index + 1}</span>,
      <span>{moment(row.ledger_created_at)?.format("DD-MM-YYYY")}</span>,
      <span> {row.ledger_amount || '$0.00'}</span>,
      <span>{row.ledger_des || 'N/A'}</span>,


    ];
  });
  return (
    <div className="p-2">
     <div className="rounded-lg shadow-lg p-3 border border-black/10 mb-6 bg-gray-200">
        <h2 className="text-xl font-semibold mb-4">Upline Income</h2>

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
  );
};

export default Direct;
