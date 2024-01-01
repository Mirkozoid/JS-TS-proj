import models from '../steamspy/steamspy.model';

const { Trending, Recent, UpcomingGame } = models;

export async function addGame(gameData: any) {
    let game;
    if (gameData.playtime === 'Информация о времени игры отсутствует') {
        const { playtime, ...filteredGameData } = gameData;
        game = await Trending.findOne({ game: gameData.game });
        if (!game) {
            game = new Trending(filteredGameData);
            await game.save();
        }
    } else {
        game = await Recent.findOne({ game: gameData.game });
        if (!game) {
            game = new Recent(gameData);
            await game.save();
        }
    }
}
export async function addUpcomigGameInfo(gameInfoData: any) {
    let gameInfo = await UpcomingGame.findOne({ title: gameInfoData.title });
    if (!gameInfo) {
        gameInfo = new UpcomingGame(gameInfoData);
        await gameInfo.save();
    }
}
