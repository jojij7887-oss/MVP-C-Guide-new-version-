// Exchange rates relative to 1 INR.
// In a real-world application, these would be fetched from a live API.
export const EXCHANGE_RATES: { [key: string]: number } = {
  INR: 1,
  USD: 1 / 83.5, // 1 USD = 83.5 INR
  EUR: 1 / 90.2, // 1 EUR = 90.2 INR
  GBP: 1 / 106.1, // 1 GBP = 106.1 INR
  JPY: 1 / 0.53, // 1 JPY = 0.53 INR
  AUD: 1 / 55.4, // 1 AUD = 55.4 INR
  CAD: 1 / 61.2, // 1 CAD = 61.2 INR
};


export const formatCurrency = (
  baseAmount: number,
  currencyCode: string,
  rate: number
) => {
  const convertedAmount = baseAmount * rate;
  // Use a neutral locale like en-US for broad support of currency symbols
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(convertedAmount);
};
