import { xAuthClient } from "../x_api/x_api";
import express from 'express'


const app = express()
const port = 3000
const STATE = "my-state";

app.get('/x_callback', async (req, res) => { 
try {
    const { code, state } = req.query;
    if (state !== STATE) return res.status(500).send("State isn't matching");
    await xAuthClient.requestAccessToken(code);
    res.redirect("/tweets");
  } catch (error) {
    console.log(error);
  }
})

app.listen(port, () => {})
