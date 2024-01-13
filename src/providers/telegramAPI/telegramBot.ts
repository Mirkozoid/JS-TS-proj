import TelegramBot from 'node-telegram-bot-api';
import { automateDiscordMessaging } from '../../lumaiGenDiscord/messaging';
import { startMessage, statusGenerationModel } from './sendMessage';
import { Token } from '../../config/env';
import { addToQueue, removeFromQueue } from '../queue/queueService';
import { createBrowserPool, getFreeBrowser, releaseBrowser } from '../discordAPI/browserPool';

async function startTelegramBot() {
    let bot = new TelegramBot(Token, { polling: true });
    await createBrowserPool();
    bot.on('message', async (msg) => {
        if (msg.text) { 
            let messagePromt: any = msg.text;               
            switch (msg.text) {
                case `/start`:
                    startMessage(bot, msg.chat.id);
                break;
                default:
                    const browser = getFreeBrowser();
                    console.log(browser);
                    if (browser) {
                        await addToQueue({ messagePromt, page: browser.page });
                        const item = await removeFromQueue(false);
                        console.log(item.msg.text);
                        if (item.msg.text) {
                            console.log(item.msg.text);
                            let links = await automateDiscordMessaging(item.msg.text, item.page);
                            statusGenerationModel(bot, item.msg.chat.id, links);
                            await removeFromQueue(true);
                        }
                        releaseBrowser(browser);
                    }
                break;                               
            }
        }
    });
    bot.on('polling_error', (error) => {
        console.log(error);
    });
}
export default startTelegramBot;