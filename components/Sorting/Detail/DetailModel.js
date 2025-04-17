export default function DetailModel({ onKeepFilters, onClearFilters }) {
  return (
    <div
      id="popup-modal"
      tabindex="-1"
      className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-50"
    >
      <div className="relative p-2 w-full lg:max-w-md max-w-sm">
        <div className="bg-white rounded-lg shadow dark:bg-darkCompBg">
          <div className="p-5 text-center">
            <h3 className="mb-4 text-lg text-lovesBlack dark:text-lovesBlack">
              You currently have active filters. Would you like to use them?
            </h3>
            <button
              onClick={onKeepFilters}
              className="py-2 px-5 mr-3 text-sm text-white bg-lovesBlack hover:bg-gray-800 rounded-lg"
            >
              Keep Current Filters
            </button>
            <button
              onClick={onClearFilters}
              className="py-2 px-5 text-sm text-white bg-lovesPrimaryRed hover:bg-lovesPrimaryRed rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
