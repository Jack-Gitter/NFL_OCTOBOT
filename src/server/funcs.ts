import { ExchangeRateResponse } from "./types";
import { Request } from 'express';
import crypto from 'crypto'

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

export const isSignatureValid = (req: Request) => {
    const signature = req.header('x-signature-sha256')
    const rawBody = JSON.stringify(req.body)
    if (!signature) {
        return false
    }
    const hash = crypto
        .createHmac('sha256', process.env.COFFEE_SECRET as string)
        .update(rawBody, 'utf8')
        .digest('hex')

      const signatureBuffer = Buffer.from(signature, 'hex')
        const hashBuffer = Buffer.from(hash, 'hex')

    if (signatureBuffer.length !== hashBuffer.length || !crypto.timingSafeEqual(signatureBuffer, hashBuffer)) {
        return false
    }
    return true
}
