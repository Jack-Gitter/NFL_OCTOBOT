import express from 'express'
import bodyParser from 'body-parser'
import { BuyMeACoffeeWebhook } from './types'
import datasource from '../datasource/datasource'

export const runServer = () => {

    const app = express()
    app.use(bodyParser.json())
    const port = Number(process.env.PORT)

    app.get('/ping', (req, res) => {
        console.log('pinged')
        res.send('pong')
    })

    app.get('/hook', async (req, res) => {
        const body: BuyMeACoffeeWebhook = req.body()
        datasource.


    }
    app.listen(port, () => {
        console.log(`Listening on ${port}`)
    })
}
