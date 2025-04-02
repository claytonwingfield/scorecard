import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import useNavigation from "@/components/Navigation/hooks/useNavigation";
import { mobileHamburgerIcon } from "@/components/Icons/icons";
import DesktopDropDownMenu from "./desktopDropDownMenu";
import MobileDropDownMenu from "./mobileDropDownMenu";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import * as Switch from "../Effects/Switch/Switch";
import { useQuery } from "@apollo/client";
import { IconMoon, IconSun } from "@/components/Icons/icons";
import { GET_LOGO } from "@/graphql/queries";
import LoadingAnimation from "../Effects/Loading/LoadingAnimation";

export default function Header() {
  const { data, loading, error } = useQuery(GET_LOGO);
  const { isMenuOpen, setIsMenuOpen, currentPage, handlePageChange, pages } =
    useNavigation();

  const { theme, setTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef(null);

  if (loading) return <LoadingAnimation />;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.logo) return <p>No logo data available</p>;

  const getLogoUrl = (logo) => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;
    if (
      logo.image &&
      Array.isArray(logo.image) &&
      logo.image.length > 0 &&
      logo.image[0].url
    ) {
      return logo.image[0].url.startsWith("http")
        ? logo.image[0].url
        : `${baseUrl}${logo.image[0].url}`;
    }
    return "/fallback-image.png";
  };

  const getLogoAlt = (logo) => {
    return logo.company || "Logo";
  };

  const toggleDarkMode = async (isDarkMode) => {
    if (
      !ref.current ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(isDarkMode ? "dark" : "light");
      return;
    }

    setIsAnimating(true);

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(isDarkMode ? "dark" : "light");
      });
    }).ready;

    const { top, left, width, height } = ref.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>

      <header className="bg-lovesWhite dark:bg-darkBg dark:shadow-none  shadow-lg w-full">
        <nav className="flex items-center justify-between lg:px-6 px-3 py-4 w-full">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center p-1">
              <Image
                alt={getLogoAlt(data.logo)}
                src={getLogoUrl(data.logo)}
                width={60}
                height={60}
              />
            </Link>
            <h1 className="font-futura-bold text-lovesBlack dark:text-darkPrimaryText lg:text-2xl text-xl mt-3">
              {currentPage}
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-6 ml-auto">
            {pages.map((page) => (
              <div key={page.name}>
                {page.isDropdown ? (
                  <DesktopDropDownMenu
                    menuTitle={page.name}
                    subPages={page.subPages}
                    handlePageChange={handlePageChange}
                  />
                ) : (
                  <Link
                    href={page.path}
                    onClick={() => handlePageChange(page.name)}
                    className="
            inline-flex items-center
            text-lovesBlack dark:text-darkPrimaryText
            text-lg font-medium font-futura-bold 
            cursor-pointer hover:text-lovesPrimaryRed dark:hover:text-lovesPrimaryRed
          "
                  >
                    {page.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-5 md:ml-3">
            <button
              className="md:hidden text-lovesBlack dark:text-darkPrimaryText flex items-center h-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {mobileHamburgerIcon}
            </button>

            <Switch.Root
              className="flex items-center h-10 lg:mb-0 mb-3"
              checked={theme === "dark"}
              onCheckedChange={(checked) => toggleDarkMode(checked)}
              aria-label="Toggle Dark Mode"
            >
              <Switch.Thumb
                ref={ref}
                className="flex items-center justify-center h-full"
              >
                {theme === "dark" ? <IconMoon /> : <IconSun />}
              </Switch.Thumb>
            </Switch.Root>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="z-50 md:hidden bg-lovesWhite dark:bg-darkBg shadow-lg w-full px-4 pb-4 space-y-2 rounded-lg">
            {pages.map((page) => (
              <div key={page.name} className="flex flex-col">
                {page.isDropdown ? (
                  <MobileDropDownMenu
                    menuTitle={page.name}
                    subPages={page.subPages}
                    handlePageChange={handlePageChange}
                  />
                ) : (
                  <Link
                    href={page.path}
                    onClick={() => handlePageChange(page.name)}
                    className="
                      block
                      text-lovesBlack dark:text-darkPrimaryText
                      text-xl font-medium font-futura-bold
                      cursor-pointer hover:text-lovesPrimaryRed dark:hover:text-lovesPrimaryRed
                    "
                  >
                    {page.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </header>

      <style jsx global>{`
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
        }
      `}</style>
    </>
  );
}
