import TelegramBot from 'node-telegram-bot-api';
import { automateDiscordMessaging } from '../../lumaiGenDiscord/messaging';
import { startMessage, statusGenerationModel } from './sendMessage';
import { Token } from '../../config/env';
import { addToQueue, removeFromQueue } from '../queue/queueService';
import { createBrowserPool, getFreeBrowser, releaseBrowser } from '../discordAPI/browserPool';


async function processQueue(bot: any) {
    let browser = getFreeBrowser();
    while (!browser) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        browser = getFreeBrowser();
    }
    const item = await removeFromQueue(true);
    if (item) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        let links = await automateDiscordMessaging(item.msg, browser.page);
        statusGenerationModel(bot, item.chatId, links);
    }
    releaseBrowser(browser);
}

async function startTelegramBot() {
    let bot = new TelegramBot(Token, { polling: true });
    await createBrowserPool();
    bot.on('message', async (msg) => {
        if (msg.text) {               
            switch (msg.text) {
                case `/start`:
                    startMessage(bot, msg.chat.id);
                break;
                default:
                    await addToQueue({ msg: msg.text, chatId: msg.chat.id });
                    processQueue(bot);
                break;                               
            }
        }
    });
    bot.on('polling_error', (error) => {
        console.log(error);
    });
}
export default startTelegramBot;