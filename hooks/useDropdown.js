import { useState } from "react";

export function useDropdown() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return { openDropdown, toggleDropdown };
}
