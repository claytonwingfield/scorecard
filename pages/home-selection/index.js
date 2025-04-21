import React, { useState } from "react";
import Header from "@/components/Navigation/header";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_HOME_PAGE } from "@/graphql/queries";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
import slugify from "slugify";

export default function HomeSelection() {
  const { data, loading, error } = useQuery(GET_HOME_PAGE);

  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error: {error.message}</p>;

  const locations = data?.homePage?.imageSection || [];

  // Helper functions for fallback images
  const getBackgroundUrl = (location) => {
    if (!location) return "/fallback.jpg";
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;
    if (location.background?.length) {
      return `${baseUrl}${location.background[0].url}`;
    }
    return "/fallback.jpg";
  };

  const getBackgroundAlt = (location) => {
    if (location.background?.length) {
      return location.background[0].alternativeText || "Background Image";
    }
    return "Background Image";
  };

  // Individual card component to handle image loading state
  const LocationCard = ({ location }) => {
    const [loaded, setLoaded] = useState(false);
    const slug = location.slug || slugify(location.city || "", { lower: true });
    const href = `/dashboard/${slug}`;
    const imageUrl = getBackgroundUrl(location);
    const altText = getBackgroundAlt(location);
    const isFallback = imageUrl === "/fallback.jpg";

    return (
      <Link
        key={location.id}
        href={href}
        className="group relative flex-1 cursor-pointer"
      >
        {/* Skeleton placeholder */}
        {!loaded && (
          <div className="absolute inset-0 bg-lovesGray animate-pulse filter dark:brightness-50 brightness-[0.65]" />
        )}

        <Image
          src={imageUrl}
          alt={altText}
          fill
          className="object-cover filter dark:brightness-50 brightness-[0.65]"
          onLoadingComplete={() => setLoaded(true)}
        />
        <Image
          src={imageUrl}
          alt={altText}
          fill
          // use contain for fallback, cover otherwise
          className={
            " object-cover filter dark:brightness-50 brightness-[0.65]"
          }
          onLoadingComplete={() => setLoaded(true)}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-lovesWhite text-3xl font-futura-bold text-center transition duration-300 ease-in-out transform group-hover:scale-125">
            {location.city} <br /> {location.text}
          </h1>
        </div>
      </Link>
    );
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative flex flex-col">
        {locations.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}

        {/* Divider(s) only when multiple locations */}
        {locations.length === 2 && (
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-px bg-lovesWhite dark:bg-darkBg" />
        )}
        {locations.length === 3 && (
          <>
            <div className="absolute left-0 right-0 top-1/3 transform -translate-y-1/3 h-px bg-lovesWhite dark:bg-darkBg" />
            <div className="absolute left-0 right-0 bottom-1/3 transform -translate-y-1/3 h-px bg-lovesWhite dark:bg-darkBg" />
          </>
        )}
      </main>
      <footer></footer>
    </div>
  );
}
