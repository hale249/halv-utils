export const getCurrentDate = (): string => {
  const [currentDate] = new Date().toISOString().split('T');
  return currentDate;
};
