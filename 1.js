const src = srcs[_.random(0, srcs.length-1)]

fs.readfile(`${_dirname}/pictures/${src}`, (error, picture) =>{
    if (error) throw new Error(error)

    bot.sendPhoto(chatId, picture)
})


bot.on('callback_query', query => {
    //console.log(json.stringify(query, null, 2))
    const base = query.data
    const symbol = 'USD'

    request(`https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=${symbol}&base=${base}`, (error, response, body) => {
        if (error) throw new Error(error)
        if (response.statusCode === 200) {

            const currencyData = JSON.parse(body)

            const html = `<b>1 ${base}</b> - <em>${currencyData.rates[symbol]} ${symbol}</em>`

            bot.sendMessage(query.message.chat.id, html, {parse_mode: 'HTML'})
        }
    })

})

&base=${base}

    - <em>${currencyData.rates[symbol]} ${symbol}</em>`

console.log(currencyData)

bot.on('callback_query', query => {
    console.log(json.stringify(query, null, 2))
    const base = query.data
    const symbol = 'USD'

    request(`https://min-api.cryptocompare.com/data/price?fsym=${base}&tsyms=${symbol}`, (error, response, body) => {
        if (error) throw new Error(error)
        if (response.statusCode === 200) {

            const currencyData = JSON.parse(body)

            console.log(currencyData)

            const html = `<b>1 ${base}</b> - <em>${currencyData.rates[symbol]} ${symbol}</em>`

            bot.sendMessage(query.message.chat.id, html, {parse_mode: 'HTML'})
        }
    })
