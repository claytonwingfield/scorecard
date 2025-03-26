import React, { useState } from "react";

export default function SearchBox({
  dataSets,
  activeFilters,
  handleSearchSelect,
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      const newSuggestions = getSuggestions(value);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  const getSuggestions = (inputValue) => {
    const lowerCaseInput = inputValue.toLowerCase();
    const results = [];

    dataSets.forEach((dataSet) => {
      const { component, data } = dataSet;

      const filteredData = data.filter((item) => {
        const relevantFields = [
          item.agent,
          item.supervisor,
          item.manager,
        ].filter(Boolean);

        const matches = relevantFields.some((val) =>
          val.toLowerCase().includes(lowerCaseInput)
        );

        const notFilteredOut = isItemNotFiltered(item, activeFilters);
        return matches && notFilteredOut;
      });

      filteredData.forEach((item) => {
        results.push({ component, item });
      });
    });

    const uniqueNames = new Set();
    const uniqueResults = [];
    for (const suggestion of results) {
      const name =
        suggestion.item.agent ||
        suggestion.item.supervisor ||
        suggestion.item.manager ||
        "Unknown";
      if (!uniqueNames.has(name)) {
        uniqueNames.add(name);
        uniqueResults.push(suggestion);
      }
    }

    return uniqueResults;
  };

  const isItemNotFiltered = (item, activeFilters) => {
    for (const filter of activeFilters) {
      const { type, label } = filter;
      if (type === "Manager" && item.manager !== label) {
        return false;
      }
      if (type === "Supervisor" && item.supervisor !== label) {
        return false;
      }
      if (type === "Agent" && item.agent !== label) {
        return false;
      }
    }
    return true;
  };

  const handleSuggestionSelect = (suggestion) => {
    handleSearchSelect(suggestion);
    setQuery("");
    setSuggestions([]);
  };

  const getSuggestionLabel = (suggestion) => {
    const { component, item } = suggestion;

    const name = item.agent || item.supervisor || item.manager || "Unknown";
    return `${name}`;
  };

  return (
    <div className="max-w-xl mx-auto lg:mt-8 mt-4 p-4 relative">
      <div className="flex">
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full text-md font-futura  text-lovesBlack border focus:outline-none border-lovesGray dark:placeholder-black rounded-lg bg-lovesWhite dark:bg-darkLightGray shadow-md dark:shadow-sm shadow-lovesGray"
            placeholder="Search Tables... "
            value={query}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-3.5 text-md font-futura-bold h-full text-lovesWhite bg-lovesPrimaryRed rounded-r-lg border border-lovesPrimaryRed"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>

      {suggestions.length > 0 ? (
        <div className="absolute mt-1 lg:inset-x-0 lg:w-full w-80 dark:border dark:border-lovesBlack bg-lovesWhite shadow-lg dark:bg-darkLightGray dark:text-lovesBlack dark:shadow-sm shadow-lovesGray  max-h-60 no-scrollbar rounded-lg border border-lovesGray  overflow-auto focus:outline-none  z-50">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="cursor-pointer select-none relative z-50 py-2 pl-3 pr-9 hover:bg-lovesGray"
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <span className="flex items-center">
                <span className="text-md font-futura ml-3 block truncate">
                  {getSuggestionLabel(suggestion)}
                </span>
              </span>
            </div>
          ))}
        </div>
      ) : query.length > 1 ? (
        <div className="absolute z-50 mt-1 inset-x-0 lg:w-full w-80 dark:border dark:border-lovesBlack ml-4 lg:ml-0 bg-lovesWhite shadow-lg rounded-md py-1  overflow-auto  dark:bg-darkLightGray dark:text-lovesBlack dark:shadow-sm">
          <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-lovesBlack text-md font-futura">
            No results found
          </div>
        </div>
      ) : null}
    </div>
  );
}
