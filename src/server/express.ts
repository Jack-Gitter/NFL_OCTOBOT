import express from 'express'

export const runServer = () => {

    const app = express()
    const port = Number(process.env.PORT)

    app.get('/ping', (req, res) => {
      res.send('pong')
    })

    app.listen(port, () => {
        console.log(`Listening on ${port}`)
    })
}
