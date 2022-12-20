export const formatCurrency = (number: number, locale = "vi-VN", options?: object) => {
  return number ? number.toLocaleString(locale, options) : "0";
};
