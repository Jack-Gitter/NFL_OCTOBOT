import express from 'express'
import bodyParser from 'body-parser'
import { BuyMeACoffeeWebhook } from './types'
import datasource from '../datasource/datasource'
import { convertToUSD } from './funcs'
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
        }

        console.log(`Donation Received! ${JSON.stringify(body)}`)

        const money = body?.data?.amount
        const name = body?.data.supporter_name
        const currency = body?.data?.currency
        const unixTimestamp = body?.data?.created_at

        const usdMoney = await convertToUSD(money, currency)

        const donation = new Donation(body?.data?.id, usdMoney, name, unixTimestamp)

        await donationRepository.save(donation)

        console.log(`Donation saved to database`)

        res.send(200)
    })

    app.listen(port, () => {
        console.log(`Listening on ${port}`)
    })
}

const isSignatureValid = (req) => {
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
        return true
    }
}
