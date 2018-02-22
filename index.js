const  TelegramBot = require('node-telegram-bot-api')
const _ = require('lodash')
const fs = require('fs')
const request = require('request')

const TOKEN = '415809423:AAGfoLLB6_yWwjArgCci9v8u8Nz2Y6jyyGs'

const bot = new TelegramBot(TOKEN, {
    polling: true
})

const KB = {
    currency: 'Курс валюты',
    picture: 'Картинки',
    pussy: 'Киски',
    cash: '$$$',
    back: 'Назад'
}

const PicScrs = {
    [KB.pussy]: [
        'cat1.jpg',
        'cat2.jpg',
        'cat3.jpg'

    ],
    [KB.cash]: [
        'cash1.jpeg',
        'cash2.jpg',
        'cash3.jpg'
    ]
}

bot.onText(/\/start/, msg=> {

      sendGreeting(msg)
})

bot.on('message', msg=> {

    switch (msg.text) {
        case KB.picture:
            sendPictureScreen(msg.chat.id)
            break
        case KB.currency:
            sendCurrencyScreen(msg.chat.id)
            break
        case KB.back:
           sendGreeting(msg, false)
            break
        case KB.cash:
        case KB.pussy:
            sendPictureByName(msg.chat.id, msg.text)
            break
    }

})

bot.on('callback_query', query => {
    //console.log(json.stringify(query, null, 2))
    const base = query.data
    const symbol = 'USD'

    request(`https://min-api.cryptocompare.com/data/price?fsym=${base}&tsyms=${symbol}`, (error, response, body) => {
        if (error) throw new Error(error)
        if (response.statusCode === 200) {

            const currencyData = JSON.parse(body)

            console.log(currencyData)

            const html = `<b>1 ${base}</b> - <em>${currencyData[symbol]} ${symbol}</em>`

            bot.sendMessage(query.message.chat.id, html, {parse_mode: 'HTML'})
        }
    })

})

function sendPictureScreen(chatId) {
bot.sendMessage(chatId, `Выберите тип картинки:`, {
    reply_markup: {
        keyboard: [
          [KB.cash, KB.pussy],
          [KB.back]
        ]
    }
})
}

function sendGreeting(msg, sayHello = true) {

    const text = sayHello
        ? `Приветствую, ${msg.from.first_name}\nЧто вы хотите сделать?`
        : `Что вы хотите сделать?`
    bot.sendMessage(msg.chat.id, text, {
        reply_markup: {
            keyboard: [
                [KB.currency,KB.picture],
            ]
        }
    })
}

function sendPictureByName(chatId, picName) {
    const srcs = PicScrs[picName]

    const src = srcs[_.random(0, srcs.length-1)]

    bot.sendMessage(chatId, `Загружаю...`)

    fs.readFile(`${__dirname}/pictures/${src}`, (error, picture) =>{
        if (error) throw new Error(error)

        bot.sendPhoto(chatId, picture).then(()=> {
            bot.sendMessage(chatId, `Отправлено!`)
        })
    })

}

function sendCurrencyScreen(chatId) {

    bot.sendMessage(chatId, `Выберите тип валюты:`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text:'BTC',
                        callback_data:'BTC'

                    }
                ],
                [
                    {
                    text:'ETH',
                    callback_data:'ETH'

                }
                ]
            ]
        }
    })

}