// components/FuturesDropdown.js

import React, { useState } from 'react';
import FuturesChart from './FuturesChart';
const FuturesDropdown = ({ setSelectedOption }) => {
  const [selectedOptionInternal, setSelectedOptionInternal] = useState('Futures');

  const handleChange = (event) => {
    setSelectedOptionInternal(event.target.value);
    setSelectedOption(event.target.value);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {selectedOptionInternal}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      <div
        className="z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <div className="py-1">
          <button
            type="button"
            onClick={() => handleChange({ target: { value: 'Futures' } })}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Futures
          </button>
          <button
            type="button"
            onClick={() => handleChange({ target: { value: 'Perpetual' } })}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Perpetual
          </button>
          <button
            type="button"
            onClick={() => handleChange({ target: { value: 'Convert' } })}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Convert
          </button>
          <button
            type="button"
            onClick={() => handleChange({ target: { value: 'Other Option' } })}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            Other Option
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuturesDropdown;