import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [dataSets, setDataSets] = useState(null);
  return (
    <DataContext.Provider value={{ dataSets, setDataSets }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
