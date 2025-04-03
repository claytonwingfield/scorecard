import React from "react";

export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="flex justify-center ">
      <div className="mt-4 px-4  lg:py-0 lg:pt-4 w-full max-w-xl ">
        <div className="relative bg-lightGray dark:bg-darkCompBg dark:rounded-lg ">
          <div
            className={`absolute top-0 left-0 h-full w-1/3 bg-darkBorder  dark:bg-darkBg dark:border-2 dark:border-darkBorder   rounded-lg transition-transform duration-300 ease-in-out ${
              activeTab === "overview"
                ? "translate-x-0"
                : activeTab === "agent"
                ? "translate-x-full"
                : "translate-x-[200%]"
            }`}
          />

          <ul className=" text-md font-futura-bold font-medium text-center text-lovesBlack dark:text-darkPrimaryText dark:border dark:border-darkBorder dark:shadow-darkBorder rounded-lg shadow-sm shadow-lovesBlack flex p-1 relative z-10">
            <li className="w-full focus-within:z-10">
              <button
                onClick={() => onTabChange("overview")}
                className={`inline-block w-full py-1 px-2 rounded-lg transition-colors duration-300 ${
                  activeTab === "overview"
                    ? "text-lovesWhite  dark:text-darkPrimaryText"
                    : "text-lovesBlack dark:text-darkPrimaryText "
                }`}
                aria-current={activeTab === "overview" ? "page" : undefined}
              >
                Overview
              </button>
            </li>
            <li className="w-full focus-within:z-10 ">
              <button
                onClick={() => onTabChange("agent")}
                className={`inline-block w-full py-1 px-2 rounded-lg transition-colors duration-300 ${
                  activeTab === "agent"
                    ? "text-lovesWhite "
                    : "text-lovesBlack dark:text-darkPrimaryText "
                }`}
                aria-current={activeTab === "agent" ? "page" : undefined}
              >
                Agent
              </button>
            </li>
            <li className="w-full focus-within:z-10 ">
              <button
                onClick={() => onTabChange("detail")}
                className={`inline-block w-full py-1 px-2 rounded-lg transition-colors duration-300 ${
                  activeTab === "detail"
                    ? "text-lovesWhite "
                    : "text-lovesBlack dark:text-darkPrimaryText "
                }`}
                aria-current={activeTab === "detail" ? "page" : undefined}
              >
                Detail
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
