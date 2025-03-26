export function filterDataSets(datasets, filterType, filterValue) {
  return datasets
    .map((set) => ({
      ...set,
      data: set.data.filter((record) => record[filterType] === filterValue),
    }))
    .filter((set) => set.data && set.data.length > 0);
}
