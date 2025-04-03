"use client";

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import loadingAnimation2 from "@/public/animations/loading2.json";

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-darkBg">
      <div className="flex items-center justify-center h-full">
        <Lottie
          animationData={loadingAnimation2}
          loop
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
        />
      </div>
    </div>
  );
}
