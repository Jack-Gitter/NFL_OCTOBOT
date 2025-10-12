import express from 'express'
import bodyParser from 'body-parser'
import { BuyMeACoffeeWebhook } from './types'
import datasource from '../datasource/datasource'
import { AllTimeDonationCount } from '../entities/AllTimeDonationCount'
import { MonthlyDonationCount } from '../entities/MonthlyDonationCount'
import { convertToUSD } from './funcs'

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

        const allTimeDonationRepository = datasource.getRepository(AllTimeDonationCount)
        const monthlyDonationRepository = datasource.getRepository(MonthlyDonationCount)

        const body: BuyMeACoffeeWebhook = req.body()

        const money = body?.data?.amount
        const name = body.data.supporter_name
        const currency = body.data.currency

        const usdMoney = await convertToUSD(money, currency)

        const allTimeDonationRecord = await allTimeDonationRepository.findOneBy({id: 1})
        if (allTimeDonationRecord) {
            if (usdMoney > allTimeDonationRecord.topDonatorAmount) {
                allTimeDonationRecord.topDonatorAmount = usdMoney
                allTimeDonationRecord.topDonatorName = name
            }
            allTimeDonationRecord.money += usdMoney
            await allTimeDonationRepository.save(allTimeDonationRecord)
        } else {
            const allTimeDonationRecord = new AllTimeDonationCount(1, usdMoney)
            await allTimeDonationRepository.save(allTimeDonationRecord)
        }




        res.send(200)
    })




    app.listen(port, () => {
        console.log(`Listening on ${port}`)
    })
}
