import express from 'express'
import bodyParser from 'body-parser'
import { BuyMeACoffeeWebhook } from './types'
import datasource from '../datasource/datasource'
import { convertToUSD } from './funcs'
import { Donation } from '../entities/Donation'

export const runServer = () => {

    const app = express()
    app.use(bodyParser.json())
    const port = Number(process.env.PORT)

    app.get('/ping', (req, res) => {
        console.log('pinged')
        res.send('pong')
    })



    app.get('/hook', async (req, res) => {
        if (!datasource.isInitialized) {
            await datasource.initialize()
        }

        const donationRepository = datasource.getRepository(Donation)

        const body: BuyMeACoffeeWebhook = req.body()

        const money = body?.data?.amount
        const name = body.data.supporter_name
        const currency = body.data.currency
        const unixTimestamp = body.created

        const usdMoney = await convertToUSD(money, currency)

        const donation = new Donation(body.event_id, usdMoney, name, unixTimestamp)

        await donationRepository.save(donation)

        res.send(200)
    })




    app.listen(port, () => {
        console.log(`Listening on ${port}`)
    })
}
