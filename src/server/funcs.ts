import { ExchangeRateResponse } from "./types";

export const convertToUSD = async (money: number, currency: string) => {
  if (currency?.toUpperCase() === "USD") return money
  const res = await fetch(
    `https://hexarate.paikama.co/api/rates/latest/${currency?.toUpperCase()}?target=USD`
  );
  const exchangeRate: ExchangeRateResponse = await res.json();
  const rate = exchangeRate.data.mid
  const usdValue = money * rate
  return usdValue
}
