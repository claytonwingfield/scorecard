import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_404 } from "@/graphql/queries";
import Header from "@/components/Navigation/header";

const Custom404 = () => {
  const { data, loading, error } = useQuery(GET_404);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading 404 page: {error.message}</p>;

  const content = data?.notFoundPage || {};

  return (
    <>
      <Header />
      <main className="grid min-h-full place-items-center bg-white dark:bg-darkBg px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold font-futura text-lovesPrimaryRed">
            {content.code || "404"}
          </p>
          <h1 className="mt-4 text-balance text-5xl font-semibold font-futura tracking-tight text-gray-900 sm:text-7xl dark:text-darkPrimaryText">
            {content.title || "Page not found"}
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium font-futura text-gray-500 sm:text-xl/8 dark:text-darkPrimaryText">
            {content.description ||
              "Sorry, we couldn’t find the page you’re looking for."}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href={content.url || "/"}
              className="rounded-md bg-lovesPrimaryRed px-3.5 py-2.5 text-sm font-semibold font-futura text-white shadow-sm hover:bg-lovesBlack hover:dark:text-lovesBlack hover:dark:bg-darkPrimaryText focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {content.buttonText || "Go back home"}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Custom404;
