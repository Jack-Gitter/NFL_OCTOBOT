import { ExchangeRateResponse } from "./types";

const convertToUSD = async (donation: {money: number, currency: string}) => {
  if (donation.currency.toUpperCase() === "USD") return donation.money
  const res = await fetch(
    `https://hexarate.paikama.co/api/rates/latest/${donation.currency.toUpperCase()}?target=USD`
  );
  const exchangeRate: ExchangeRateResponse = await res.json();
  const rate = exchangeRate.data.mid
  const usdValue = donation?.money * rate
  return usdValue
}
