"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import defaultAwardAnimation from "@/public/animations/award.json";

const renameMap = {
  "Average Handle Time": "Handle Time",
  "Average Score": "Score",
};
const StatCard = ({
  name,
  stat,
  qualifies,
  delay = 0,
  onClick = () => {},
  isActive = false,
  awardAnimationData = defaultAwardAnimation,
}) => {
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
      setStartAnimation(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);
  const textColorClass = isActive
    ? qualifies
      ? "text-lovesGreen"
      : "text-lovesPrimaryRed"
    : qualifies
    ? "text-lovesGreen"
    : "text-lovesPrimaryRed";

  const cardBg = isActive
    ? "bg-darkCompBg dark:bg-darkBg "
    : animationFinished
    ? "bg-darkBorder"
    : "bg-lovesBlack dark:bg-darkPrimaryText";

  const nameTextColorClass = isActive ? "text-lovesWhite" : "text-lovesWhite";

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer relative rounded-lg shadow-md dark:shadow-sm shadow-lovesBlack dark:shadow-darkBorder overflow-hidden border-2 dark:border ${
        isActive
          ? qualifies
            ? "animate-glow border-lovesGreen dark:border-lovesGreen"
            : "border-lovesPrimaryRed dark:border-lovesPrimaryRed"
          : "border-lovesBlack dark:border-lovesBlack"
      } ${cardBg}`}
      style={{ transition: "background-color 1s ease-in-out" }}
    >
      {animationFinished &&
        (qualifies ? (
          <div className="absolute top-0 right-0 p-2 ">
            <Lottie
              animationData={awardAnimationData}
              loop={true}
              speed={0.1}
              style={{ width: "50px", height: "50px" }}
            />
          </div>
        ) : (
          <div className="absolute top-2 right-3 p-2"></div>
        ))}

      <div
        className="relative p-6 flex flex-col items-center justify-center"
        style={{
          opacity: animationFinished ? 1 : 0,
          transition: "opacity 1s ease-in-out",
        }}
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
            {stat}
          </p>
        </dd>
      </div>
    </div>
  );
};

export default StatCard;
