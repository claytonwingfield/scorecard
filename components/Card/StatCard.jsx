// Card/StatCard.jsx
"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import defaultAwardAnimation from "@/public/animations/award.json";

const renameMap = {
  "Average Handle Time": "Handle Time",
  "Average Score": "Score",
};

// *** Add 'id' to the destructured props here ***
const StatCard = ({
  name,
  stat,
  qualifies,
  delay = 0,
  onClick = () => {},
  isActive = false,
  awardAnimationData = defaultAwardAnimation,
  id, // Now 'id' is correctly received as a prop
}) => {
  // *** console.log should now work ***
  console.log(
    `[StatCard - ${name} (${id})] Received props - name: ${name}, stat: ${stat}, qualifies: ${qualifies}, isActive: ${isActive}`
  );

  const [animationFinished, setAnimationFinished] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 1240);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  const displayName = renameMap[name] ? renameMap[name] : name;

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true); // This state isn't currently used, might remove later
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Determine text color based on qualification and active state
  const textColorClass = isActive
    ? qualifies
      ? "text-lovesGreen"
      : "text-lovesPrimaryRed"
    : qualifies
    ? "text-lovesGreen"
    : "text-lovesPrimaryRed";

  // Determine background color
  const cardBg = isActive ? "bg-darkCompBg dark:bg-darkBg " : "bg-darkBorder"; // Simplified background logic

  // Determine name text color
  const nameTextColorClass = isActive ? "text-lovesWhite" : "text-lovesWhite"; // Always white now

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer relative rounded-lg shadow-md dark:shadow-sm shadow-lovesBlack dark:shadow-darkBorder overflow-hidden border-2 dark:border ${
        isActive // Dynamic border based on active and qualifies state
          ? qualifies
            ? "animate-glow border-lovesGreen dark:border-lovesGreen" // Green glow if active and qualified
            : "border-lovesPrimaryRed dark:border-lovesPrimaryRed" // Red border if active but not qualified
          : "border-lovesBlack dark:border-lovesBlack" // Default border if not active
      } ${cardBg}`} // Apply background color
      // Removed inline transition style, handle with CSS if needed
    >
      {/* Award animation */}
      {qualifies && ( // Simpler condition: Show if qualified (animationFinished state removed for simplicity)
        <div className="absolute top-0 right-0 p-2 ">
          <Lottie
            animationData={awardAnimationData}
            loop={true}
            speed={0.1}
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      )}

      {/* Main content area */}
      <div
        className="relative p-6 flex flex-col items-center justify-center"
        // Removed opacity style for debugging visibility
      >
        <dt className="flex flex-col items-center text-center">
          <p
            className={`truncate text-lg font-futura-bold ${nameTextColorClass}`}
          >
            {displayName}
          </p>
        </dt>
        <dd className="flex flex-col items-center justify-center pt-4">
          <p
            className={`text-3xl font-semibold font-futura-bold ${textColorClass} glow`}
          >
            {/* Display the stat value */}
            {stat}
          </p>
          {/* You can uncomment this debug paragraph if needed */}
          {/* <p style={{color: 'cyan', fontSize: '10px'}}>Debug Stat: {stat}</p> */}
        </dd>
      </div>
    </div>
  );
};

export default StatCard;
