import React, { useState } from "react";

const quickLayouts = [
  {
    name: "Layout 1",
    layout: [
      {
        i: "ScoreCardTable",
        x: 0,
        y: 0,
        w: 1,
        h: 32,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },

      {
        i: "AttainmentGoal",
        x: 1,
        y: 2,
        w: 1,
        h: 7,

        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageHandleTimeGoal",
        x: 1,
        y: 4,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "QualityGoal",
        x: 1,
        y: 6,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AdherenceGoal",
        x: 1,
        y: 8,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageScore",
        x: 1,
        y: 8,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
    ],
    preview: (
      <div className=" max-w-xs grid grid-cols-2 gap-x-1 gap-y-1">
        <div className="h-60 w-full bg-lovesGray rounded col-span-1"></div>
        <div className="col-span-1 grid grid-rows-5 gap-y-1">
          <div className="h-12 w-12 bg-lovesGray rounded"></div>
          <div className="h-12 w-12 bg-lovesGray rounded"></div>
          <div className="h-12 w-12 bg-lovesGray rounded"></div>
          <div className="h-12 w-12 bg-lovesGray rounded"></div>
          <div className="h-12 w-12 bg-lovesGray rounded"></div>
        </div>
      </div>
    ),
  },
  {
    name: "Layout 2",
    layout: [
      {
        i: "ScoreCardTable",
        x: 0,
        y: 0,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },

      {
        i: "AttainmentGoal",
        x: 1,
        y: 2,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageHandleTimeGoal",
        x: 1,
        y: 4,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "QualityGoal",
        x: 1,
        y: 6,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AdherenceGoal",
        x: 1,
        y: 8,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageScore",
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
  {
    name: "Layout 3",
    layout: [
      {
        i: "ScoreCardTable",
        x: 0,
        y: 0,
        w: 2,
        h: 9,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },

      {
        i: "AttainmentGoal",
        x: 0,
        y: 2,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageHandleTimeGoal",
        x: 1,
        y: 4,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "QualityGoal",
        x: 0,
        y: 6,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AdherenceGoal",
        x: 1,
        y: 8,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageScore",
        x: 0,
        y: 8,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
    ],
    preview: (
      <div className=" max-w-xs w-full grid grid-cols-2 gap-x-2 gap-y-2">
        <div className="h-20 w-full bg-lovesGray rounded col-span-2"></div>

        <div className="col-span-1 flex flex-col gap-y-1">
          <div className="h-12 w-12 bg-lovesGray rounded"></div>
          <div className="h-12 w-12 bg-lovesGray rounded"></div>
          <div className="h-12 w-12 bg-lovesGray rounded"></div>
        </div>

        <div className="col-span-1 flex flex-col gap-y-1">
          <div className="h-12 w-12 bg-lovesGray rounded"></div>
          <div className="h-12 w-12 bg-lovesGray rounded"></div>
        </div>
      </div>
    ),
  },
  {
    name: "Layout 4",
    layout: [
      {
        i: "ScoreCardTable",
        x: 0,
        y: 4,
        w: 2,
        h: 9,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },

      {
        i: "AttainmentGoal",
        x: 0,
        y: 6,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageHandleTimeGoal",
        x: 1,
        y: 0,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "QualityGoal",
        x: 0,
        y: 6,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AdherenceGoal",
        x: 1,
        y: 8,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageScore",
        x: 0,
        y: 0,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
    ],
    preview: (
      <div className=" max-w-lg w-full grid grid-cols-2 gap-x-1 gap-y-1">
        <div className="h-12 w-full bg-lovesGray rounded col-span-1"></div>
        <div className="h-12 w-full bg-lovesGray rounded col-span-1"></div>

        <div className="h-20 w-full bg-lovesGray rounded col-span-2"></div>

        <div className="h-12 w-12 bg-lovesGray rounded col-span-1"></div>
        <div className="h-12 w-12 bg-lovesGray rounded col-span-1"></div>
        <div className="h-12 w-12 bg-lovesGray rounded col-span-1"></div>
      </div>
    ),
  },
  {
    name: "Layout 5",
    layout: [
      {
        i: "ScoreCardTable",
        x: 0,
        y: 8,
        w: 2,
        h: 9,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },

      {
        i: "AttainmentGoal",
        x: 1,
        y: 4,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageHandleTimeGoal",
        x: 0,
        y: 0,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "QualityGoal",
        x: 0,
        y: 2,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AdherenceGoal",
        x: 1,
        y: 2,
        w: 1,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageScore",
        x: 0,
        y: 7,
        w: 2,
        h: 7,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
    ],
    preview: (
      <div className=" max-w-lg w-full grid grid-cols-2 gap-x-1 gap-y-1">
        <div className="h-12 w-full bg-lovesGray rounded col-span-1"></div>
        <div className="h-12 w-full bg-lovesGray rounded col-span-1"></div>
        <div className="h-12 w-12 bg-lovesGray rounded col-span-1"></div>
        <div className="h-12 w-12 bg-lovesGray rounded col-span-1"></div>
        <div className="h-12 w-full bg-lovesGray rounded col-span-2"></div>
        <div className="h-20 w-full bg-lovesGray rounded col-span-2"></div>
      </div>
    ),
  },
  {
    name: "Layout 6",
    layout: [
      {
        i: "ScoreCardTable",
        x: 0,
        y: 1,
        w: 2,
        h: 8,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },

      {
        i: "AttainmentGoal",
        x: 1,
        y: 4,
        w: 1,
        h: 6,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageHandleTimeGoal",
        x: 0,
        y: 0,
        w: 2,
        h: 6,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "QualityGoal",
        x: 0,
        y: 2,
        w: 1,
        h: 6,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AdherenceGoal",
        x: 1,
        y: 2,
        w: 1,
        h: 6,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
      {
        i: "AverageScore",
        x: 0,
        y: 4,
        w: 1,
        h: 6,
        resizeHandles: ["se", "sw", "ne", "nw"],
      },
    ],
    preview: (
      <div className=" max-w-lg w-full grid grid-cols-2 gap-x-1 gap-y-1">
        <div className="h-12 w-full bg-lovesGray rounded col-span-2"></div>
        <div className="h-20 w-full bg-lovesGray rounded col-span-2"></div>
        <div className="h-12 w-full bg-lovesGray rounded col-span-1"></div>
        <div className="h-12 w-full bg-lovesGray rounded col-span-1"></div>
        <div className="h-12 w-12 bg-lovesGray rounded col-span-1"></div>
        <div className="h-12 w-12 bg-lovesGray rounded col-span-1"></div>
      </div>
    ),
  },
];

export default function LayoutOptions({
  onLayoutSelect,
  onRevertToDefault,
  onSaveLayout,
}) {
  const [selectedLayoutIndex, setSelectedLayoutIndex] = useState(null);
  return (
    <div className="bg-lovesBlack dark:border dark:border-lovesWhite p-8 rounded-lg">
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
