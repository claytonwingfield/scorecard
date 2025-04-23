import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function AccessRequestModal({ content, buttonText }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleRequestAccess = () => {
    // TODO: fire your request‑access logic here, sending `reason` as part of the payload
    console.log("Access requested with reason:", reason);
    setIsOpen(false);
    setReason("");
  };

  return (
    <>
      <div className="mt-10 mb-24">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center text-lovesBlack uppercase dark:text-darkPrimaryText text-xl font-futura font-semibold hover:underline transition"
        >
          {buttonText || content.buttonText}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative bg-white dark:bg-darkCompBg p-6 rounded-2xl w-full max-w-sm font-futura">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-lovesBlack hover:text-lovesPrimaryRed dark:text-darkPrimaryText dark:hover:text-lovesPrimaryRed transition"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-futura-bold mb-2 text-lovesBlack dark:text-darkPrimaryText">
              Request Access
            </h2>
            <p className="mb-4 text-gray-700 dark:text-darkPrimaryText">
              You need permission to view this page. Please let us know why you
              need access.
            </p>

            <label
              htmlFor="reason"
              className="block text-md font-futura-bold text-gray-700 dark:text-darkPrimaryText"
            >
              Reason for Access
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a brief reason why you need access"
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-lovesPrimaryRed focus:border-lovesPrimaryRed dark:border-darkBorder dark:bg-darkBorder dark:placeholder-darkSecondaryText dark:darkSecondaryText"
            />

            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={handleRequestAccess}
                disabled={!reason.trim()}
                className="px-4 py-2 bg-lovesPrimaryRed text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
