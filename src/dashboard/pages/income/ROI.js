import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { apiConnectorGet } from '../../../utils/APIConnector';
import { endpoint } from '../../../utils/APIRoutes';
import CustomTable from '../../../Shared/CustomTable';
import CustomToPagination from '../../../Shared/Pagination';
import { useFormik } from 'formik';
import moment from 'moment';

const ROI = () => {
  const [page, setPage] = useState(1);
  const client = useQueryClient();

  const initialValues = {
    income_Type: '',
    search: '',
    pageSize: 10,
    start_date: '',
    end_date: '',
  };

  const fk = useFormik({
    initialValues,
    enableReinitialize: true,
  });

  const { isLoading, data } = useQuery(
    ['roi_income_api', page],
    () =>
      apiConnectorGet(
        `${endpoint?.roi_income_api}?income_type=ROI&page=${page}`
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

  const tablerow = allData?.data?.map((row, index) => [
    <span>{index + 1}</span>,
    <span>{moment(row.ledger_created_at).format('DD-MM-YYYY')}</span>,
    <span>{row.ledger_amount || '$0.00'}</span>,
    <span>{row.ledger_des || 'N/A'}</span>,
  ]);

  return (
    <div className="p-2 text-black">
      {/* Header Filter Box */}
      <div className="rounded-lg shadow-lg p-3 border border-black/10 mb-6 bg-gray-200">
        <h2 className="text-xl font-semibold mb-4">ROI Income</h2>

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
                client.invalidateQueries(["reward_income_api"]);
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

        <div className="flex justify-end py-2 text-white font-semibold">
          Total Income: ${allData?.totalAmount || 0}
        </div>

        <CustomToPagination page={page} setPage={setPage} data={allData} />
      </div>
    </div>
  );
};

export default ROI;
