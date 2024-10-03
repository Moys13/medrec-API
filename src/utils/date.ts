export const dateHandle = (
  start?: string | undefined,
  end?: string | undefined,
) => {
  const startDateString =
    start || `02-01-${new Date().getFullYear().toString()}`;
  const endDateString = end || `31-12-${new Date().getFullYear().toString()}`;

  const [startDay, startMonth, startYear] = startDateString
    .split(/[-/]/)
    .map(Number);
  const [endDay, endMonth, endYear] = endDateString.split(/[-/]/).map(Number);

  const startDate = new Date(startYear, startMonth - 1, startDay);
  const endDate = new Date(endYear, endMonth - 1, endDay);

  endDate.setHours(23, 59, 59, 999);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};
