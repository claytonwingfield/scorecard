import Header from "@/components/Navigation/header";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_ALL_LOCATIONS } from "@/graphql/queries";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
export default function HomeSelection() {
  const { data, loading, error } = useQuery(GET_ALL_LOCATIONS);

  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error: {error.message}</p>;

  const locations = data?.locations || [];

  const getBackgroundUrl = (location) => {
    if (
      location.background &&
      Array.isArray(location.background) &&
      location.background.length > 0
    ) {
      return `http://172.26.132.93:1337${location.background[0].url}`;
    }
    return "/fallback.jpg";
  };

  const getBackgroundAlt = (location) => {
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
        <Link
          href="/dashboard/oklahoma-city"
          className="group relative flex-1 cursor-pointer"
        >
          <Image
            src={getBackgroundUrl(locations[0])}
            alt={getBackgroundAlt(locations[0])}
            unoptimized
            fill
            className="object-cover filter brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl font-futura-bold text-center">
              {locations[0].city} <br /> Contact Center
            </h1>
          </div>
        </Link>
        <Link href="/dashboard/santo-domingo" className="group relative flex-1">
          <Image
            src={getBackgroundUrl(locations[1])}
            alt={getBackgroundAlt(locations[1])}
            unoptimized
            fill
            className="object-cover filter brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl font-futura-bold text-center">
              Contact Us <br /> {locations[1].city}
            </h1>
          </div>
        </Link>

        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-px bg-white" />
      </main>
      <footer></footer>
    </div>
  );
}
