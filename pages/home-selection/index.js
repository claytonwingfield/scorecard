import Header from "@/components/Navigation/header";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_HOME_PAGE } from "@/graphql/queries";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";

export default function HomeSelection() {
  const { data, loading, error } = useQuery(GET_HOME_PAGE);

  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error: {error.message}</p>;

  const locations = data?.homePage?.imageSection || [];

  const oklahomaLocation = locations.find(
    (location) => location.city === "Oklahoma City"
  );
  const santoDomingoLocation = locations.find(
    (location) => location.city === "Santo-Domingo"
  );

  const getBackgroundUrl = (location) => {
    if (!location) return "/fallback.jpg";
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;
    if (
      location.background &&
      Array.isArray(location.background) &&
      location.background.length > 0
    ) {
      return `${baseUrl}${location.background[0].url}`;
    }
    return "/fallback.jpg";
  };

  const getBackgroundAlt = (location) => {
    if (!location) return "Background Image";
    if (
      location.background &&
      Array.isArray(location.background) &&
      location.background.length > 0
    ) {
      return location.background[0].alternativeText || "Background Image";
    }
    return "Background Image";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative flex flex-col">
        {oklahomaLocation && (
          <Link
            href="/dashboard/oklahoma-city"
            className="group relative flex-1 cursor-pointer"
          >
            <Image
              src={getBackgroundUrl(oklahomaLocation)}
              alt={getBackgroundAlt(oklahomaLocation)}
              fill
              className="object-cover filter dark:brightness-50 brightness-[0.65]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-white text-3xl font-futura-bold text-center transition duration-300 ease-in-out transform group-hover:scale-125">
                {oklahomaLocation.city} <br /> {oklahomaLocation.text}
              </h1>
            </div>
          </Link>
        )}
        {santoDomingoLocation && (
          <Link
            href="/dashboard/santo-domingo"
            className="group relative flex-1"
          >
            <Image
              src={getBackgroundUrl(santoDomingoLocation)}
              alt={getBackgroundAlt(santoDomingoLocation)}
              fill
              className="object-cover filter dark:brightness-50 brightness-[0.65]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-white text-3xl font-futura-bold text-center transition duration-300 ease-in-out transform group-hover:scale-125">
                {santoDomingoLocation.text} <br /> {santoDomingoLocation.city}
              </h1>
            </div>
          </Link>
        )}

        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-px bg-white" />
      </main>
      <footer></footer>
    </div>
  );
}
