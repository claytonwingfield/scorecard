import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_503 } from "@/graphql/queries";
import Header from "@/components/Navigation/header";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import AccessRequestModel from "@/components/Model/AccessRequestModel";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import maintenance from "@/public/animations/maintenance.json";
import maintenanceDark from "@/public/animations/maintenanceDark.json";
import { useTheme } from "next-themes";
const Custom503 = () => {
  const { data, loading, error } = useQuery(GET_503);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error loading 403 page: {error.message}</p>;

  const content = data?.serviceUnavailable || {};

  const getBackgroundUrl = () => {
    const raw = content.background?.[0]?.url;
    if (raw) {
      return `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${raw}`;
    }

    return "/fallback.jpeg";
  };

  const bgUrl = getBackgroundUrl();

  return (
    <>
      <Header />
      <main className="grid min-h-full place-items-center bg-white dark:bg-darkBg px-6 py-30 sm:py-16 lg:px-8 ">
        <div className="max-w-lg text-center ">
          <p className="md:mt-5  mt-20 text-2xl font-futura font-semibold uppercase text-lovesBlack dark:text-darkPrimaryText md:mb-20 mb-16">
            {content.title}
          </p>

          <div className="flex justify-center items-center">
            <h1 className="flex items-center leading-none">
              <span
                className="pl-8
    relative inline-block
    text-[12rem] sm:text-[15rem] md:text-[18rem]
    font-extrabold font-futura-bold
    text-lovesPrimaryRed 
    text-stroke-yellow
  "
                style={{
                  WebkitTextFillColor: "currentColor",
                  textShadow: "0 12px 4px rgba(0,0,0,0.25)",
                }}
              >
                5
              </span>
              <span
                className="
       relative
        
        inline-block
        z-12 lg:-mx-8 -mx-8
        
        font-extrabold font-futura-bold
        text-lovesPrimaryRed  
        z-30 text-stroke-yellow transform md:scale-[3] scale-[3] drop-shadow-[0_12px_4px_rgba(0,0,0,0.25)] 
      "
                style={{
                  WebkitTextFillColor: "currentColor",
                  textShadow: "0 12px 4px rgba(0,0,0,0.25)",
                }}
              >
                {isDarkMode ? (
                  <Lottie
                    animationData={maintenanceDark}
                    loop
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Lottie
                    animationData={maintenance}
                    loop
                    style={{ width: "100%", height: "100%" }}
                  />
                )}
              </span>
              <span
                className="pr-8
    relative inline-block
    text-[12rem] sm:text-[15rem] md:text-[18rem]
    font-extrabold font-futura-bold
    text-lovesPrimaryRed 
    z-14 text-stroke-yellow
  "
                style={{
                  WebkitTextFillColor: "currentColor",
                  textShadow: "0 12px 4px rgba(0,0,0,0.25)",
                }}
              >
                3
              </span>
            </h1>
          </div>

          <p className="mt-6 text-xl font-futura  uppercase text-lovesBlack dark:text-darkPrimaryText">
            {content.description}
          </p>

          <div className="mt-10 mb-32">
            <Link
              href={content.url}
              className="inline-flex items-center text-lovesBlack uppercase dark:text-darkPrimaryText text-xl font-futura font-semibold hover:underline transition"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              {content.buttonText}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Custom503;
