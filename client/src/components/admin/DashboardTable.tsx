import React from 'react';

type DashboardTableProps = {
  headers: string[];
  rows: React.ReactNode[][]
}
const DashboardTable = ({ headers, rows }: DashboardTableProps) => {
  return (
    <table
      className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/30 border-collapse rounded-lg overflow-hidden shadow-sm">
      <thead className="bg-gray-50 dark:bg-gray-800/50">
      <tr>
        {headers.map((header) => (
          <th
            key={header}
            className="p-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
          >
            {header}
          </th>
        ))}
      </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {rows.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors duration-150"
        >
          {row.map((cell, cellIndex) => (
            <td
              key={cellIndex}
              className="p-3 text-sm text-gray-700 dark:text-gray-300"
            >
              {cell}
            </td>
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default DashboardTable;
