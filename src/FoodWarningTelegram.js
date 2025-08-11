import TelegramBot from 'node-telegram-bot-api';
import {config} from "dotenv";

config();

let DB_TOKEN = process.env.DB_TOKEN_TELEGRAM

const bot = new TelegramBot(DB_TOKEN, { polling: true });

let aguaInterval = null;
let FoodInterval = null;

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text?.toLowerCase();

    if (text === 'acordei') {
        clearInterval(aguaInterval);
        clearInterval(FoodInterval);

        bot.sendMessage(chatId, 'Beber agua em jejum é muito importante, faz isso dai')

        aguaInterval = setInterval(() => {
            bot.sendMessage(chatId, 'Hora de beber água paizão!');
        }, 20 * 60 * 1000); // 20 minutos

        FoodInterval = setInterval(() => {
            bot.sendMessage(chatId, 'Hora de comer major!');
        }, 3 * 60 * 60 * 1000); // 3 horas

        bot.sendMessage(chatId, '✅ Lembretes iniciados!');
    }

    if (text === 'dormir') {
        clearInterval(aguaInterval);
        clearInterval(FoodInterval);
        bot.sendMessage(chatId, 'Boa noite! Lembretes parados.');
    }
});
