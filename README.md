# Meitre Telegram bot
Telegram's bot to be notified when places are available on [meitre](https://meitre.com/en) reservation system.

You will need to create a `.env` file with the same variables defined in `.env.example`

- `MEITRE_ID`: meitre id. You can get it from the API by opening the dev console and seeing the network tab.
- `PEOPLE_AMOUNT`: amount of people for the reservation
- `TYPE`: `lunch` or `dinner`
- `TELEGRAM_API_KEY`: telegram API key
- `LINK`: Link of the meitre
- `POLLING_TIME`: Check availability each X seconds
- `CHAT_ID`: Channel Id if was added to a channel

## Telegram Channels

- [Anchoita](https://t.me/anchoita_cena_2): Dinner for 2.
- [Julia](https://t.me/julia_cena_2) Dinner for 2.


There are a lot of things that we can do here if you want to contribute ❤️
- Ask for specific amount of people and type
- Reservations: Book, Remind, Cancel.
- More, more, more and more...


## Comands
- `/check`: chequea si hay lugar
