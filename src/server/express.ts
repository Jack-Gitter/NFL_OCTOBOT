import express from 'express'

export const runServer = () => {

    const app = express()
    const port = 3000

    app.get('/ping', (req, res) => {
      res.send('pong')
    })

    app.listen(port, () => {
        console.log(`Listening on ${port}`)
    })
}
