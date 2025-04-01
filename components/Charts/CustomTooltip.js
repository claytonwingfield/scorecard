import React from "react";

const CustomTooltip = ({
  active,
  payload,
  label,
  average,
  goal,
  isDarkMode,
  xDataKey,
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  const labelTitle = xDataKey === "date" ? "Date" : "Name";

  return (
    <div
      className={`p-2 border rounded ${
        isDarkMode
          ? "bg-black border-gray-200 text-lovesWhite font-futura"
          : "bg-lovesWhite border-lovesBlack text-lovesBlack font-futura"
      }`}
    >
      <p>{`${labelTitle}: ${label}`}</p>
      <p
        className={`${
          isDarkMode
            ? "text-lovesWhite font-futura"
            : "text-lovesBlack font-futura"
        }`}
      >{`${payload[0].name}: ${Number(payload[0].value).toFixed(2)}`}</p>
      <p className="text-lovesGreen font-futura">{`Goal: ${goal}`}</p>
      <p className="text-lovesOrange font-futura">{`Average: ${average}`}</p>
    </div>
  );
};

export default CustomTooltip;
