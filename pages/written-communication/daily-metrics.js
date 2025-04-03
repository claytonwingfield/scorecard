import Header from "@/components/Navigation/header";

export default function WrittenCommunicationDailyMetrics() {
  return (
    <div>
      <Header />
      <main className="mt-8 p-3">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-lg font-futura-bold text-lovesBlack dark:text-darkPrimaryText">
                Written Communication Scorecard
              </h1>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col space-y-4"></div>
            <div className="flex-grow flex flex-col"></div>
          </div>
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
