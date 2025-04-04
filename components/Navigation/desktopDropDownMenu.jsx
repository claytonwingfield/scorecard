import { useState, useRef } from "react";
import Link from "next/link";
import { DesktopDropdownIcon } from "@/components/Icons/icons";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function DesktopDropDownMenu({
  menuTitle,
  subPages,
  handlePageChange,
  nested = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [openSubIndex, setOpenSubIndex] = useState(null);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    if (!isManual) {
      setIsOpen(true);
    }
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
    setIsManual(!isManual);
  };

  useClickOutside([dropdownRef], () => {
    if (isOpen) {
      setIsOpen(false);
      setIsManual(false);
    }
  });

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={handleButtonClick}
        className="
        inline-flex items-center
        p-2
        text-lovesBlack dark:text-darkPrimaryText
        text-lg font-medium font-futura-bold
        cursor-pointer hover:text-lovesPrimaryRed 
         dark:hover:bg-darkBg  dark:hover:text-lovesPrimaryRed 
      "
      >
        <span>{menuTitle}</span>
        <DesktopDropdownIcon isOpen={isOpen} className="ml-2" />
      </button>

      {isOpen && (
        <div
          className={` absolute top-full
        ${nested ? "left-full" : "left-[-120px]"}
        z-50 mt-2 bg-lovesWhite dark:bg-darkBg
        shadow-lg w-60 min-w-[200px]
         rounded-lg shadow-md shadow-lovesBlack
        divide-y divide-lovesBlack`}
        >
          {subPages.map((subPage, idx) => {
            if (subPage.isDropdown && subPage.subPages?.length > 0) {
              const subIsOpen = openSubIndex === idx;

              return (
                <div key={subPage.name} className="p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (subIsOpen) {
                        setOpenSubIndex(null);
                      } else {
                        setOpenSubIndex(idx);
                      }
                    }}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <span className="text-lovesBlack dark:text-darkPrimaryText text-lg font-medium font-futura-bold">
                      {subPage.name}
                    </span>

                    <DesktopDropdownIcon isOpen={subIsOpen} />
                  </button>

                  {subIsOpen && (
                    <div className="mt-2  pl-3">
                      {subPage.subPages.map((nestedItem) => (
                        <Link
                          key={nestedItem.name}
                          href={nestedItem.path}
                          onClick={() => {
                            handlePageChange(nestedItem.name);
                            setIsOpen(false);
                            setOpenSubIndex(null);
                          }}
                          className="
                          block w-full py-1
                          text-lovesBlack dark:text-darkPrimaryText
                          text-lg font-medium font-futura-bold
                          hover:text-lovesPrimaryRed dark:hover:text-lovesPrimaryRed
                        "
                        >
                          {nestedItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <Link
                  key={subPage.name}
                  href={subPage.path}
                  onClick={() => {
                    handlePageChange(subPage.name);
                    setIsOpen(false);
                    setOpenSubIndex(null);
                  }}
                  className="
                  block w-full p-2
                  text-lovesBlack dark:text-darkPrimaryText
                  text-lg font-medium font-futura-bold
                  hover:bg-lovesGray dark:hover:bg-darkPrimaryText
                  dark:hover:text-darkBg
                "
                >
                  {subPage.name}
                </Link>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
