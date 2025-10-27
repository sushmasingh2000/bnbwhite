// import React from "react";
// import { Skeleton } from "@mui/material";

// // Dot Component for status indication
// const Dot = ({ active }) => (
//   <div
//     className={`w-2.5 h-2.5 rounded-full mx-auto ${
//       active ? "bg-green-500" : "bg-gray-400"
//     }`}
//   />
// );

// const CustomTable = ({
//   tablehead = [],
//   tablerow = [],
//   className,
//   isLoading,
// }) => {
//   return (
//     <div className={`w-full overflow-auto p-4 ${className || ""}`}>
//       <div className="rounded-xl shadow-sm border border-white/10 overflow-auto min-w-full bg-black">
//         <table className="min-w-max text-sm text-white">
//           <thead className="bg-white/10 text-white text-xs font-semibold">
//             <tr>
//               {Array.isArray(tablehead) &&
//                 tablehead.map((column, index) => (
//                   <th
//                     key={index}
//                     scope="col"
//                     className="px-4 py-3 text-center border-b border-white/10"
//                   >
//                     {column}
//                   </th>
//                 ))}
//             </tr>
//           </thead>

//           <tbody>
//             {isLoading ? (
//               Array.from({ length: 10 }).map((_, rowIndex) => (
//                 <tr key={rowIndex} className="border-b border-white/10">
//                   {tablehead.map((_, cellIndex) => (
//                     <td
//                       key={cellIndex}
//                       className="px-4 py-3 text-center whitespace-nowrap"
//                     >
//                       <Skeleton animation="wave" height={20} />
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : tablerow.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={tablehead.length || 1}
//                   className="text-center text-gray-400 px-4 py-6"
//                 >
//                   No data found
//                 </td>
//               </tr>
//             ) : (
//               tablerow.map((row, rowIndex) => (
//                 <tr
//                   key={rowIndex}
//                   className="hover:bg-white/5 transition-colors border-b border-white/10"
//                 >
//                   {row.map((cell, cellIndex) => (
//                     <td
//                       key={cellIndex}
//                       className="px-4 py-3 text-center text-sm text-white whitespace-nowrap"
//                     >
//                       {cell === "dot" || cell === "inactive" || typeof cell === "boolean" ? (
//                         <Dot active={cell === true || cell === "dot"} />
//                       ) : (
//                         cell
//                       )}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default CustomTable;
import React from "react";
import { Skeleton } from "@mui/material";

// Dot status indicator
const Dot = ({ active }) => (
  <div
    className={`w-2.5 h-2.5 rounded-full mx-auto ${
      active ? "bg-green-500" : "bg-red-400"
    }`}
  />
);

const CustomTable = ({
  tablehead = [],
  tablerow = [],
  className,
  isLoading,
}) => {
  return (
    <div className={`w-full overflow-auto p-4 ${className || ""}`}>
      <div className="rounded-xl border border-gray-200 overflow-auto min-w-full bg-white shadow-md">
        <table className="min-w-max table-auto text-sm text-black">
          <thead className="bg-gray-100 text-black text-xs font-semibold">
            <tr>
              {Array.isArray(tablehead) &&
                tablehead.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-4 py-3 text-center border-b border-gray-200"
                  >
                    {column}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100">
                  {tablehead.map((_, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-center whitespace-nowrap"
                    >
                      <Skeleton animation="wave" height={20} />
                    </td>
                  ))}
                </tr>
              ))
            ) : tablerow.length === 0 ? (
              <tr>
                <td
                  colSpan={tablehead.length || 1}
                  className="text-center text-gray-500 px-4 py-6"
                >
                  No data found
                </td>
              </tr>
            ) : (
              tablerow.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-center text-sm text-black whitespace-nowrap"
                    >
                      {cell === "dot" || cell === "inactive" || typeof cell === "boolean" ? (
                        <Dot active={cell === true || cell === "dot"} />
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;
