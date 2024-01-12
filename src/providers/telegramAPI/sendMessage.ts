import TelegramBot from 'node-telegram-bot-api';

async function startMessage(bot: TelegramBot, chatId: number) {
    await bot.sendMessage(chatId, "Enter the promt to generate the model.");
}
async function statusGenerationModel(bot: TelegramBot, chatId: number, imgLinks: string[]) {
    const photos = imgLinks.map(imgLink => ({
        type: 'photo',
        media: imgLink
    }) as TelegramBot.InputMediaPhoto);
    await bot.sendMediaGroup(chatId, photos);
}

export { startMessage, statusGenerationModel };