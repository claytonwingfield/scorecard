import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function useNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Home");
  const router = useRouter();

  const pages = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Dashboard",
      path: "/dashboard/oklahoma-city",
    },
    {
      name: "Dashboard",
      path: "/dashboard/santo-domingo",
    },
    // Default Scorecard dropdown (non-DR)
    {
      name: "Scorecard",
      isDropdown: true,
      isDr: false,
      subPages: [
        {
          name: "Help Desk",
          path: "/help-desk/daily-metrics",
          isDropdown: true,
          subPages: [
            {
              name: "Scorecard",
              path: "/customer-service/daily-metrics",
              headerName: "Customer Service",
            },
            {
              name: "Manager",
              path: "/customer-service/daily-metrics/manager",
              headerName: "CS Manager",
            },
            {
              name: "Supervisor",
              path: "/customer-service/daily-metrics/supervisor",
              headerName: "CS Supervisor",
            },
            {
              name: "Agent",
              path: "/customer-service/daily-metrics/agent",
              headerName: "CS Agent",
            },
          ],
        },
        {
          name: "Customer Service",
          path: "/customer-service/daily-metrics",
          isDropdown: true,
          subPages: [
            {
              name: "Scorecard",
              path: "/customer-service/daily-metrics",
              headerName: "Customer Service",
            },
            {
              name: "Manager",
              path: "/customer-service/daily-metrics/manager",
              headerName: "CS Manager",
            },
            {
              name: "Supervisor",
              path: "/customer-service/daily-metrics/supervisor",
              headerName: "CS Supervisor",
            },
            {
              name: "Agent",
              path: "/customer-service/daily-metrics/agent",
              headerName: "CS Agent",
            },
          ],
        },
        {
          name: "Electronic Dispatch",
          path: "/electronic-dispatch/daily-metrics",
          isDropdown: true,
          subPages: [
            {
              name: "Scorecard",
              path: "/customer-service/daily-metrics",
              headerName: "Customer Service",
            },
            {
              name: "Manager",
              path: "/customer-service/daily-metrics/manager",
              headerName: "CS Manager",
            },
            {
              name: "Supervisor",
              path: "/customer-service/daily-metrics/supervisor",
              headerName: "CS Supervisor",
            },
            {
              name: "Agent",
              path: "/customer-service/daily-metrics/agent",
              headerName: "CS Agent",
            },
          ],
        },
        {
          name: "Written Communication",
          path: "/written-communication/daily-metrics",
          isDropdown: true,
          subPages: [
            {
              name: "Scorecard",
              path: "/customer-service/daily-metrics",
              headerName: "Customer Service",
            },
            {
              name: "Manager",
              path: "/customer-service/daily-metrics/manager",
              headerName: "CS Manager",
            },
            {
              name: "Supervisor",
              path: "/customer-service/daily-metrics/supervisor",
              headerName: "CS Supervisor",
            },
            {
              name: "Agent",
              path: "/customer-service/daily-metrics/agent",
              headerName: "CS Agent",
            },
          ],
        },
        {
          name: "Resolutions",
          path: "/resolutions/daily-metrics",
          isDropdown: true,
          subPages: [
            {
              name: "Scorecard",
              path: "/customer-service/daily-metrics",
              headerName: "Customer Service",
            },
            {
              name: "Manager",
              path: "/customer-service/daily-metrics/manager",
              headerName: "CS Manager",
            },
            {
              name: "Supervisor",
              path: "/customer-service/daily-metrics/supervisor",
              headerName: "CS Supervisor",
            },
            {
              name: "Agent",
              path: "/customer-service/daily-metrics/agent",
              headerName: "CS Agent",
            },
          ],
        },
      ],
    },
    // DR Scorecard dropdown (DR version)
    {
      name: "Scorecard",
      isDropdown: true,
      isDr: true,
      subPages: [
        {
          name: "Help Desk",
          path: "/santo-domingo/help-desk/daily-metrics",
          isDropdown: true,
          subPages: [
            {
              name: "Scorecard",
              path: "/santo-domingo/customer-service/daily-metrics",
              headerName: "Customer Service",
            },
            {
              name: "Manager",
              path: "/santo-domingo/customer-service/daily-metrics/manager",
              headerName: "CS Manager",
            },
            {
              name: "Supervisor",
              path: "/santo-domingo/customer-service/daily-metrics/supervisor",
              headerName: "CS Supervisor",
            },
            {
              name: "Agent",
              path: "/santo-domingo/customer-service/daily-metrics/agent",
              headerName: "CS Agent",
            },
          ],
        },
        {
          name: "Customer Service",
          path: "/santo-domingo/customer-service/daily-metrics",
          isDropdown: true,
          subPages: [
            {
              name: "Scorecard",
              path: "/santo-domingo/customer-service/daily-metrics",
              headerName: "Customer Service",
            },
            {
              name: "Manager",
              path: "/santo-domingo/customer-service/daily-metrics/manager",
              headerName: "CS Manager",
            },
            {
              name: "Supervisor",
              path: "/santo-domingo/customer-service/daily-metrics/supervisor",
              headerName: "CS Supervisor",
            },
            {
              name: "Agent",
              path: "/santo-domingo/customer-service/daily-metrics/agent",
              headerName: "CS Agent",
            },
          ],
        },
      ],
    },
  ];

  // Filter navigation items
  const filteredPages = pages.filter((page) => {
    // For Scorecard dropdowns, use existing logic.
    if (page.name === "Scorecard") {
      if (router.pathname === "/") {
        return false;
      }
      if (
        router.pathname.startsWith("/dashboard/santo-domingo") ||
        router.pathname.startsWith("/santo-domingo")
      ) {
        return page.isDr === true;
      }
      return page.isDr !== true;
    }
    // For Dashboard link
    if (page.name === "Dashboard") {
      // Hide Dashboard link on Home page
      if (router.pathname === "/") {
        return false;
      }
      // For Santo Domingo routes, show the Dashboard link that routes to /dashboard/santo-domingo
      if (
        router.pathname.startsWith("/dashboard/santo-domingo") ||
        router.pathname.startsWith("/santo-domingo")
      ) {
        return page.path === "/dashboard/santo-domingo";
      }
      // For all other routes, show the Oklahoma City Dashboard link
      return page.path === "/dashboard/oklahoma-city";
    }
    return true;
  });

  // Flatten navigation for current page detection.
  const allPages = filteredPages.flatMap((page) => {
    if (page.isDropdown && page.subPages) {
      return page.subPages.flatMap((sub) =>
        sub.isDropdown && sub.subPages ? sub.subPages : sub
      );
    }
    return page;
  });

  // Optional: Define custom names for dashboard routes.
  const dashboardNames = {
    "/dashboard/oklahoma-city": "Oklahoma City Dashboard",
    "/dashboard/santo-domingo": "Santo Domingo Dashboard",
  };

  useEffect(() => {
    // Check if current route matches one of the dashboard routes.
    if (dashboardNames[router.pathname]) {
      setCurrentPage(dashboardNames[router.pathname]);
      return;
    }
    const current = allPages.find((p) => p.path === router.pathname);
    if (current) {
      setCurrentPage(current.headerName || current.name);
    } else {
      setCurrentPage("Page Not Found");
    }
  }, [router.pathname, allPages]);

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
  };
}
