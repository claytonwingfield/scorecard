import { useState, useRef } from "react";
import Link from "next/link";
import { MobileDropDownIcon } from "@/components/Icons/icons";
import { useClickOutside } from "@/hooks/useClickOutside";
export default function MobileDropDownMenu({
  menuTitle,
  subPages,
  handlePageChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const dropdownRef = useRef(null);

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
    <div ref={dropdownRef}>
      <div className="flex items-center justify-between w-full ">
        <button
          onClick={handleButtonClick}
          className="text-lovesBlack text-xl mb-1 mt-1 font-medium font-futura-bold dark:text-darkPrimaryText  cursor-pointer hover:text-lovesPrimaryRed flex-grow text-left"
        >
          {menuTitle}
        </button>
        <button
          onClick={handleButtonClick}
          className="text-lovesBlack dark:text-darkPrimaryText"
        >
          <MobileDropDownIcon isOpen={isOpen} />
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col space-y-1 ml-2 divide-y divide-lovesGray">
          {subPages.map((subPage) => {
            if (subPage.isDropdown && subPage.subPages?.length > 0) {
              return (
                <MobileDropDownMenu
                  key={subPage.name}
                  menuTitle={subPage.name}
                  subPages={subPage.subPages}
                  handlePageChange={handlePageChange}
                  nested
                />
              );
            } else {
              return (
                <Link
                  key={subPage.name}
                  href={subPage.path}
                  onClick={() => {
                    handlePageChange(subPage.name);
                    setIsOpen(false);
                  }}
                  className="block text-lovesBlack dark:text-darkPrimaryText text-lg font-medium font-futura-bold pt-2 hover:text-lovesPrimaryRed"
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
