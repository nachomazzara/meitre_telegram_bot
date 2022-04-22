require('isomorphic-fetch')
require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')

const telegramToken = process.env.TELEGRAM_API_KEY
const meitreId = process.env.MEITRE_ID
const peopleAmount = process.env.PEOPLE_AMOUNT
const type = process.env.TYPE
const pollingTime = parseInt(process.env.POLLING_TIME)

const bot = new TelegramBot(telegramToken, { polling: true })

let initialized = false

async function check(chatId, repeat = true) {
  try {
    const res = await fetch(`http://api.meitre.com/api/calendar-availability-new/${meitreId}/${peopleAmount}/${type}`)
    const { calendarInfo } = await res.json()

    const dates = calendarInfo.filter(date => parseInt(date.isAvailable))
    let message = ''

    if (!dates.length) {
      message = 'Nothing available yet'
    } else {
      message = 'Availability: \n'
      message += dates.map(({date}) => {
        const d = new Date(date)
        return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
      }).join('\n')
    }

    await bot.sendMessage(chatId, message)
  } catch (e) {
    console.log(`An error ocurred: ${e.message}`)
  }

  if (repeat) {
    setTimeout(() => check(chatId), pollingTime * 1000)
  }
}

// Start the check polling
bot.on('message', (msg) => {
  const chatId = msg.chat.id

  if (!initialized) {
    initialized = true
    check(chatId)
  }
})

// Start the check polling
bot.onText(/^check/i, (msg) => {
  check(msg.chat.id, false)
})
