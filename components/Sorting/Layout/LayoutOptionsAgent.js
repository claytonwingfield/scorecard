import React, { useState } from "react";

const quickLayouts = [
  {
    name: "Layout 1",
    layout: [
      {
        i: "TeamOne",
        x: 0,
        y: 0,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },

      {
        i: "TeamTwo",
        x: 1,
        y: 2,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "TeamThree",
        x: 1,
        y: 4,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "TeamFour",
        x: 1,
        y: 6,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "TeamFive",
        x: 1,
        y: 8,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "TeamSix",
        x: 1,
        y: 8,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
    ],
    preview: (
      <div className=" max-w-xs grid grid-cols-1 gap-x-1 gap-y-1">
        <div className="row-span-2 grid grid-rows-5 gap-y-1">
          <div className="h-10 w-20 bg-lovesGray rounded"></div>
          <div className="h-10 w-20 bg-lovesGray rounded"></div>
          <div className="h-10 w-20 bg-lovesGray rounded"></div>
          <div className="h-10 w-20 bg-lovesGray rounded"></div>
          <div className="h-10 w-20 bg-lovesGray rounded"></div>
          <div className="h-10 w-20 bg-lovesGray rounded"></div>
        </div>
      </div>
    ),
  },
];

export default function LayoutOptionsAgent({
  onLayoutSelect,
  onRevertToDefault,
  onSaveLayout,
}) {
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState(null);
  return (
    <div className="bg-lovesBlack dark:border dark:border-darkPrimaryText p-8 rounded-lg">
      <div className="mb-3 text-lg font-futura-bold text-lovesWhite flex items-center justify-center gap-x-6 space-y-3">
        <h2>Quick Layouts</h2>
      </div>
      <div className="flex flex-row items-start justify-center space-x-12 ">
        {quickLayouts.map((quickLayout, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center cursor-pointer focus:outline-none"
            onClick={() => {
              setSelectedLayoutIndex(index);
              onLayoutSelect(quickLayout.layout);
            }}
          >
            <p className="mb-2 text-lovesWhite text-lg font-futura">
              {quickLayout.name}
            </p>

            <div
              className={`${
                selectedLayoutIndex === index
                  ? "bg-lovesPrimaryRed animate-pulse"
                  : "animate-pulse"
              } p-2 rounded-lg`}
            >
              {quickLayout.preview}
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-center gap-x-6 ">
        <button
          type="button"
          onClick={onRevertToDefault}
          className="text-md font-futura-bold px-3 py-2 rounded-lg bg-lovesPrimaryRed  text-lovesWhite"
        >
          Revert To Default
        </button>
        <button
          type="button"
          onClick={onSaveLayout}
          className="inline-flex border border-lovesWhite justify-center rounded-md bg-lovesBlack px-12 py-2 text-md font-futura-bold text-lovesWhite shadow-sm hover:bg-lovesWhite hover:text-lovesBlack"
        >
          Save
        </button>
      </div>
    </div>
  );
}
