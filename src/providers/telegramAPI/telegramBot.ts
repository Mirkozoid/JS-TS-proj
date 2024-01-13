import TelegramBot from 'node-telegram-bot-api';
import { automateDiscordMessaging, startBrowserAndLogin } from '../../lumaiGenDiscord/discordMessageAutomation';
import { Token } from '../../config/env'
import { startMessage, statusGenerationModel } from './sendMessage';

async function startTelegramBot() {
    let bot = new TelegramBot(Token, { polling: true });
    startBrowserAndLogin();
    bot.on('message', async (msg) => {
        var chatId = msg.chat.id;
        if (msg.text) {                
            switch (msg.text) {
                case `/start`:
                    startMessage(bot, chatId);
                break;
                default:
                    let links = await automateDiscordMessaging(msg.text);
                    statusGenerationModel(bot, chatId, links);
                break;                               
            }
        }
    });
    bot.on('polling_error', (error) => {
        console.log(error);
    });
}
export default startTelegramBot;