import express from 'express'
import bodyParser from 'body-parser'
import { BuyMeACoffeeWebhook } from './types'
import datasource from '../datasource/datasource'
import { convertToUSD, isSignatureValid } from './funcs'
import { Donation } from '../entities/Donation'
import crypto from 'crypto'

export const runServer = () => {

    const app = express()
    app.use(bodyParser.json())
    const port = Number(process.env.PORT)

    app.get('/ping', (req, res) => {
        console.log('pinged')
        res.send('pong')
    })

    app.post('/hook', async (req, res) => {
        if (!datasource.isInitialized) {
            await datasource.initialize()
        }

        const donationRepository = datasource.getRepository(Donation)

        const body: BuyMeACoffeeWebhook = req.body

            
        const valid = isSignatureValid(req)
        if (!valid) {
            res.status(403).send(`Invalid Signature`)
            return
        }

        console.log(`Donation Received! ${JSON.stringify(body)}`)

        const money = body?.data?.amount
        const name = body?.data.supporter_name
        const currency = body?.data?.currency
        const unixTimestamp = body?.data?.created_at
        const donatorId = body?.data.supporter_id

        const usdMoney = await convertToUSD(money, currency)

        const donation = new Donation(body?.data?.id, usdMoney, name, unixTimestamp, donatorId)

        await donationRepository.save(donation)

        console.log(`Donation saved to database`)

        res.send(`Saved Donation`)
    })

    app.listen(port, () => {
        console.log(`Listening on ${port}`)
    })
}

