export type BuyMeACoffeeWebhook = {
   type: string,
   live_mode: boolean,
   attempt: number,
   created: number,
   event_id: number,
   data: {
      id: number,
      amount: number,
      object: string,
      status: string,
      message: string,
      currency: string,
      refunded: string,
      created_at: number,
      note_hidden: string,
      refunded_at: Date
      support_note: string,
      support_type: string,
      supporter_name: string,
      supporter_name_type: string,
      transaction_id: string,
      application_fee: string,
      supporter_id: number,
      supporter_email: string,
      total_amount_charged: number,
      coffee_count: 1,
      coffee_price: 5
   }
}

export type ExchangeRateResponse = {
  status_code: number,
  data: {
    base: string,
    target: string,
    mid: number,
    unit: number,
    timestamp: string,
  }
}
