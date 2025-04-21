import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_NAVIGATION } from "@/graphql/queries";

export default function useNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Home");
  const [navPages, setNavPages] = useState([]);
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_NAVIGATION);

  const transformNavigationItem = (item) => {
    const newItem = { ...item };

    if (item.extraSubPages && item.extraSubPages.length > 0) {
      newItem.subPages = item.extraSubPages.map(transformNavigationItem);
      newItem.isDropdown = true;
    } else if (item.subPages && item.subPages.length > 0) {
      newItem.subPages = item.subPages.map(transformNavigationItem);
    } else {
      newItem.subPages = [];
    }
    return newItem;
  };

  useEffect(() => {
    if (data && data.nav && data.nav.NavigationItem) {
      const transformedPages = data.nav.NavigationItem.map(
        transformNavigationItem
      );
      setNavPages(transformedPages);
    }
  }, [data]);

  const filteredPages = navPages.filter((page) => {
    if (page.name === "Department") {
      if (router.pathname === "/") return false;
      if (
        router.pathname.startsWith("/dashboard/santo-domingo") ||
        router.pathname.startsWith("/santo-domingo")
      ) {
        return page.isDominicanRepublic === true;
      }
      return page.isDominicanRepublic !== true;
    }

    if (page.name === "Dashboard") {
      if (
        router.pathname.startsWith("/dashboard/santo-domingo") ||
        router.pathname.startsWith("/santo-domingo")
      ) {
        return page.path === "/dashboard/santo-domingo";
      }
      return page.path === "/dashboard/oklahoma-city";
    }

    return true;
  });

  const findPageByPath = (pagesArray, path) => {
    for (const page of pagesArray) {
      if (page.path === path) return page;
      if (page.subPages && page.subPages.length > 0) {
        const found = findPageByPath(page.subPages, path);
        if (found) return found;
      }
    }
    return null;
  };

  const dashboardNames = {
    "/dashboard/oklahoma-city": "Oklahoma City Dashboard",
    "/dashboard/santo-domingo": "Santo Domingo Dashboard",
  };

  useEffect(() => {
    if (router.pathname === "/403") {
      setCurrentPage("Restricted Access");
      return;
    }
    if (dashboardNames[router.pathname]) {
      setCurrentPage(dashboardNames[router.pathname]);
      return;
    }
    const current = findPageByPath(filteredPages, router.pathname);
    if (current) {
      setCurrentPage(current.headerName || current.name);
    } else {
      setCurrentPage("Page Not Found");
    }
  }, [router.pathname, filteredPages]);

  const handlePageChange = (pageName) => {
    setCurrentPage(pageName);
    setIsMenuOpen(false);
  };

  return {
    isMenuOpen,
    setIsMenuOpen,
    currentPage,
    handlePageChange,
    pages: filteredPages,
    loading,
    error,
  };
}
