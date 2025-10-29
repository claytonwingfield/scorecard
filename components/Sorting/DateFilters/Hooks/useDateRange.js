import { useState, useCallback } from "react"; // Added useCallback

// Helper to check if a date is valid
const isValidDate = (d) => d instanceof Date && !isNaN(d);

function getStartOfMonth() {
  const now = new Date();
  // Ensure calculations use valid dates, default to epoch if 'now' is somehow invalid
  const validNow = isValidDate(now) ? now : new Date(0); // Use epoch (Jan 1, 1970) as a safe fallback
  // Use UTC methods to avoid timezone issues with month start
  const start = new Date(
    Date.UTC(validNow.getUTCFullYear(), validNow.getUTCMonth(), 1)
  );
  // Ensure the calculated start date is valid, otherwise use the valid 'now' date (set to UTC start of day)
  const todayUTCStart = new Date(
    Date.UTC(
      validNow.getUTCFullYear(),
      validNow.getUTCMonth(),
      validNow.getUTCDate()
    )
  );
  return isValidDate(start) ? start : todayUTCStart;
}

function getToday() {
  const now = new Date();
  // Return a valid date (UTC start of day), defaulting to epoch if 'now' is invalid
  const todayUTCStart = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  );
  return isValidDate(todayUTCStart) ? todayUTCStart : new Date(0); // Use epoch as fallback
}

export function useDateRange() {
  // Initialize state with functions that return valid UTC dates
  const [fromDate, setFromDate] = useState(() => getStartOfMonth());
  const [toDate, setToDate] = useState(() => getToday());
  // Ensure initial currentDate is valid (use today's date, not necessarily UTC for display)
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return isValidDate(now) ? now : new Date(); // Use local 'now' as fallback for calendar view
  });

  const navigateMonth = useCallback((offset) => {
    // Wrap in useCallback
    setCurrentDate((prevDate) => {
      // Ensure prevDate is valid before operating on it
      const validPrevDate = isValidDate(prevDate) ? prevDate : new Date(); // Fallback to current local time
      const newDate = new Date(validPrevDate);
      try {
        // Use setMonth for navigation, it handles month/year rollovers
        newDate.setMonth(newDate.getMonth() + offset);
        // Ensure the result is valid
        return isValidDate(newDate) ? newDate : validPrevDate; // Revert to previous valid date if calculation failed
      } catch (e) {
        console.error("Error navigating month:", e);
        return validPrevDate; // Revert on error
      }
    });
  }, []); // No dependencies needed if it only uses setCurrentDate

  // This function might be called by Calendar.js if passed down,
  // ensures state updates correctly based on Calendar's internal logic.
  const handleDateSelect = useCallback(
    (date) => {
      if (!isValidDate(date)) {
        console.warn(
          "useDateRange handleDateSelect received invalid date:",
          date
        );
        return;
      }
      // Convert incoming date (likely local time from picker) to UTC start of day
      const selectedUTCDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );

      setFromDate((currentFrom) => {
        setToDate((currentTo) => {
          const validFrom = isValidDate(currentFrom) ? currentFrom : null;
          const validTo = isValidDate(currentTo) ? currentTo : null;

          // Start new selection or restart
          if (!validFrom || (validFrom && validTo)) {
            return selectedUTCDate; // New fromDate
          }
          // Setting end date
          else if (validFrom && !validTo) {
            if (selectedUTCDate.getTime() < validFrom.getTime()) {
              return selectedUTCDate; // New fromDate (selected before old fromDate)
            } else {
              return validFrom; // Keep existing fromDate
            }
          }
          return validFrom; // Should not happen, but return current state
        });

        // Now determine toDate based on the *new* fromDate (or existing one)
        setToDate((currentTo) => {
          const validFrom = isValidDate(fromDate) ? fromDate : null; // Use the *actual* current fromDate state
          const validTo = isValidDate(currentTo) ? currentTo : null;

          // Start new selection or restart
          if (!validFrom || (validFrom && validTo)) {
            return null; // Clear toDate when setting new fromDate
          }
          // Setting end date
          else if (validFrom && !validTo) {
            if (selectedUTCDate.getTime() >= validFrom.getTime()) {
              return selectedUTCDate; // Set as toDate
            } else {
              return null; // Clear toDate because new fromDate was set
            }
          }
          return validTo; // Should not happen
        });
        return fromDate; // Return the current fromDate for the setFromDate call (might be updated above)
      });
    },
    [fromDate, toDate]
  ); // Depend on state

  return {
    currentDate,
    setCurrentDate,
    fromDate,
    setFromDate, // Pass this down
    toDate,
    setToDate, // Pass this down
    navigateMonth,
    handleDateSelect, // Provide this unified handler
  };
}
