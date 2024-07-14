import React, { useState, useMemo, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import { parseFileContent } from '../utils/parseFile';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiCopy, FiX } from 'react-icons/fi'; // Import FiCopy and FiX icons


const Dashboard = () => {
  const [tableData, setTableData] = useState(null);
  const [filters, setFilters] = useState({
    input: '',
    title: '',
    status_code: '',
    content_length: '',
    port: '',
    url: '',
  });
  const [copied, setCopied] = useState(false); // State to manage copied message
  const [showCounts, setShowCounts] = useState(false); // State to control visibility of counts container

  useEffect(() => {
    // Clear copied message after 3 seconds
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const handleFileUpload = (content) => {
    const parsedData = parseFileContent(content);
    setTableData(parsedData);
    setShowCounts(true); // Show counts container after file upload
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle copy to clipboard
  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url); // Using modern clipboard API
    setCopied(true); // Set copied state to true
  };

  // Function to count occurrences of 'url' field in tableData
  const countUrlOccurrences = () => {
    if (!tableData) return 0;
    return tableData.data.filter(row =>
      row['url']?.toString().toLowerCase().includes(filters['url'].toLowerCase())
    ).length;
  };

  const filteredData = useMemo(() => {
    if (!tableData) return [];
    return tableData.data.filter((row) =>
      Object.keys(filters).every((key) =>
        row[key]?.toString().toLowerCase().includes(filters[key].toLowerCase())
      )
    );
  }, [filters, tableData]);

  return (
    <div className="min-h-screen bg-customColor1 dark:bg-dot-white/[0.2] bg-dot-white/[0.2] relative flex flex-col items-center justify-center p-4">
      {!tableData && <FileUpload onFileUpload={handleFileUpload} />}
      {tableData && (
        <>
          <div className="mb-4 w-full  max-w-7xl flex flex-wrap justify-center">
            {Object.keys(filters).map((key) => (
              <form key={key} className="max-w-md  bg-customColor mx-2 mb-4">
                <label 
                  htmlFor={key}
                  className="mb-2 text-sm font-medium bg-customColor1 sr-only dark:text-white"
                >
                  Search
                </label>
                <div className="relative flex items-center">
                  <input
                    type="search"
                    id={key}
                    name={key}
                    value={filters[key]}
                    onChange={handleFilterChange}
                    placeholder={`Filter by ${key}`}
                    className="block w-full p-4 text-sm text-gray-900 border border-gray-500 rounded-lg bg-customColor focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
              </form>
            ))}
          </div>
          <div className="absolute top-4 right-4">
            {showCounts && (
              <div className="p-4 dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 dark:text-white">URL Count:</h3>
                  <p className="text-gray-300 dark:text-gray-300">{countUrlOccurrences()}</p>
                </div>
              </div>
            )}
          </div>
          <div className="w-full h-[70vh] p-4 glass border-4 overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left text-white">
                <thead>
                  <tr>
                    {tableData.headers.map((header) => (
                      <th key={header} className="px-4 py-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {tableData.headers.map((header) => (
                        <td key={header} className="border px-4 py-2">
                          {header === 'url' ? (
                            <>
                              <a
                                href={row[header]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline"
                              >
                                {row[header]}
                              </a>
                              <div className="ml-2 flex-shrink-0 z-10 inline-flex items-center">
                                <CopyToClipboard text={row[header]} onCopy={() => handleCopyUrl(row[header])}>
                                  <button
                                    type="button"
                                    className="p-1 text-white rounded hover:bg-gold-500 hover:text-gold-900 focus:outline-none"
                                  >
                                    <FiCopy className="w-4 h-4" />
                                  </button>
                                </CopyToClipboard>
                              </div>
                            </>
                          ) : (
                            row[header]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {copied && (
            <div className="absolute bottom-4 left-4 right-4 bg-gray-800 text-white p-2 rounded shadow-lg flex items-center justify-between">
              <span>Copied to clipboard!</span>
              <button onClick={() => setCopied(false)} className="text-white">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;