require('isomorphic-fetch')
require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')

const telegramToken = process.env.TELEGRAM_API_KEY
const meitreId = process.env.MEITRE_ID
const peopleAmount = process.env.PEOPLE_AMOUNT
const type = process.env.TYPE
const link = process.env.LINK
const pollingTime = parseInt(process.env.POLLING_TIME)

const bot = new TelegramBot(telegramToken, { polling: true })

let initialized = false

async function check(chatId, repeat = true) {
  let message = ''

  try {
    const dateRes = await fetch(`http://api.meitre.com/api/calendar-availability-new/${meitreId}/${peopleAmount}/${type}`)
    const { calendarInfo } = await dateRes.json()

    const dates = calendarInfo.filter(date => parseInt(date.isAvailable))

    if (!dates.length) {
      message = 'Nothing available yet\n'
    } else {
      message = 'Availability: \n'
      for (let {date} of dates) {
        const d = new Date(date)
        const slotsRes = await fetch(
          `https://api.meitre.com/api/search-all-hours/en/${peopleAmount}/${d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()}/dinner/${meitreId}`
        )
        const slots = await slotsRes.json()
        message += `${d.getDate()}/${(d.getMonth() + 1)}/${d.getFullYear()}\n`

        for (let slot of slots.center.slots) {
          message += `    ${slot.hour}\n`
        }
      }
      message += `\n\nLink: ${link}\n`
    }
  } catch (e) {
    message += `An error ocurred: ${e.message}`
  }

  await bot.sendMessage(chatId, message)
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
bot.onText(/^\/check/i, (msg) => {
  check(msg.chat.id, false)
})
