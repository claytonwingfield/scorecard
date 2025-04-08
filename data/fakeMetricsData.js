"use client";
const averageHandleTimeGoal = "5:30 - 6:30";
const qualityGoal = "88%";
const adherenceGoal = "88%";
const averageScoreGoal = "95%";

function generateRandomMetricValue(metricName) {
  if (metricName === "Average Handle Time") {
    // generate a random time between 5:00 (300 sec) and 6:30 (390 sec)
    let seconds = Math.floor(Math.random() * (390 - 300 + 1)) + 300;
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  } else if (metricName === "Average Score") {
    // generate a random percentage between 90% and 105%
    let value = (Math.random() * 15 + 90).toFixed(2);
    return `${value}%`;
  } else if (metricName === "Adherence") {
    // generate a random percentage between 85% and 95%
    let value = (Math.random() * 10 + 85).toFixed(2);
    return `${value}%`;
  } else if (metricName === "Quality") {
    // generate a random percentage between 80% and 95%
    let value = (Math.random() * 15 + 80).toFixed(2);
    return `${value}%`;
  }
  return "0%";
}

function formatSecondsToMMSS(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

function generateRandomAHTSeconds() {
  const minSeconds = 5 * 60;
  const maxSeconds = 7 * 60;
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
}
function generateRandomAHTFormatted() {
  const seconds = generateRandomAHTSeconds();
  return formatSecondsToMMSS(seconds);
}

function generateFakeDataForMarch2025ForMetric(metricKey, generator) {
  const data = [];
  const startDate = new Date(2025, 2, 1);
  const endDate = new Date(2025, 2, 31);
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const formattedDate = `${
      currentDate.getMonth() + 1
    }/${currentDate.getDate()}`;
    data.push({ date: formattedDate, [metricKey]: generator() });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return data;
}

export const fakeAHTData = generateFakeDataForMarch2025ForMetric(
  "ahtTeam",
  generateRandomAHTFormatted
);

export const fakeAdherenceData = generateFakeDataForMarch2025ForMetric(
  "adherence",
  () => generateRandomMetricValue("Adherence")
);
export const fakeQualityData = generateFakeDataForMarch2025ForMetric(
  "qualityTeam",
  () => generateRandomMetricValue("Quality")
);
export const fakeMtdScoreData = generateFakeDataForMarch2025ForMetric(
  "mtdScore",
  () => generateRandomMetricValue("Average Score")
);
