const baseurl = `https://api.x.com/2/tweets`

export const post = async () => {
    const res  = await fetch(baseurl, {
        method: 'POST',
        headers: {'content-type': 'application/json', 'authorization': `Bearer ${process.env.X_BEARER_TOKEN}`},
        body: JSON.stringify({
            text: 'testing!'
        })
    })

    const data = await res.json()
    console.log(data)
}

