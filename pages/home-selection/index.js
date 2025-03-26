import Header from "@/components/Navigation/header";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_ALL_LOCATIONS } from "@/graphql/queries";
export default function HomeSelection() {
  const { data, loading, error } = useQuery(GET_ALL_LOCATIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const locations = data?.locations || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative flex flex-col">
        <Link
          href="/dashboard/oklahoma-city"
          className="group relative flex-1 cursor-pointer"
        >
          <Image
            src="/okc.jpg"
            alt="Oklahoma City Background"
            fill
            className="object-cover filter brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl font-futura-bold text-center">
              {locations[1].city} <br /> Contact Center
            </h1>
          </div>
        </Link>
        <Link href="/dashboard/santo-domingo" className="group relative flex-1">
          <Image
            src="/dr.jpg"
            alt="Santo Domingo Background"
            fill
            className="object-cover filter brightness-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-white text-3xl font-futura-bold text-center">
              Contact Us <br /> {locations[0].city}
            </h1>
          </div>
        </Link>

        <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-px bg-white" />
      </main>
      <footer></footer>
    </div>
  );
}
