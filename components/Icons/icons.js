import React from "react";

export const defaultSort = (
  <svg
    className="dark:text-lovesBlack "
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    height={16}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
    />
  </svg>
);

export const upArrow = (
  <svg
    className="dark:text-lovesBlack"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    height={16}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
    />
  </svg>
);

export const downArrow = (
  <svg
    className="dark:text-lovesBlack"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    height={16}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
    />
  </svg>
);
export const mobileHamburgerIcon = (
  <svg
    className="w-6 h-6 dark:text-lovesWhite"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
export const DesktopDropdownIcon = ({ isOpen }) => (
  <svg
    className={`ml-2 transform transition-transform dark:text-lovesWhite ${
      isOpen ? "rotate-180" : ""
    }`}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 9l6 6 6-6"
    />
  </svg>
);

export const MobileDropDownIcon = ({ isOpen }) => (
  <svg
    className={`w-5 h-5 transform transition-transform dark:text-lovesWhite ${
      isOpen ? "rotate-180" : ""
    }`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 9l6 6 6-6"
    />
  </svg>
);
export const IconSun = () => {
  return (
    <svg
      className="dark:hidden block"
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sun icon paths */}
      <path
        className="fill-lovesBlack"
        d="M7 0h2v2H7zM12.88 1.637l1.414 1.415-1.415 1.413-1.413-1.414zM14 7h2v2h-2zM12.95 14.433l-1.414-1.413 1.413-1.415 1.415 1.414zM7 14h2v2H7zM2.98 14.364l-1.413-1.415 1.414-1.414 1.414 1.415zM0 7h2v2H0zM3.05 1.706 4.463 3.12 3.05 4.535 1.636 3.12z"
      />
      <path
        className="fill-lovesBlack"
        d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z"
      />
    </svg>
  );
};

export const IconMoon = () => {
  return (
    <svg
      className="hidden dark:block dark:text-white"
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Moon icon paths */}
      <path
        className="fill-lovesWhite"
        d="M6.2 1C3.2 1.8 1 4.6 1 7.9 1 11.8 4.2 15 8.1 15c3.3 0 6-2.2 6.9-5.2C9.7 11.2 4.8 6.3 6.2 1Z"
      />
      <path
        className="fill-lovesWhite"
        d="M12.5 5a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 5Z"
      />
    </svg>
  );
};
