import puppeteer from 'puppeteer';
import { Url } from '../config/env';
import { addGame } from '../providers/addingUserToDB';

interface GameInfo {
  rank: string;
  game: string;
  releaseDate: string;
  price: string;
  scoreRank: string;
  owners: string;
  playtime: string;
}

export async function getInfoTrendingRecentGames(): Promise<GameInfo[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(Url);
  let gameInfo: GameInfo[] = [];
  let hasNextPage = true;
  while (hasNextPage) {
    const newInfo = (await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr'));
      return rows.map(row => {
        const columns = Array.from(row.querySelectorAll('td'));
        if (columns.length === 0) {
          return null;
        }
        const linkElement = columns[1].querySelector('a');
        return {
          rank: columns[0].innerText,
          game: linkElement ? linkElement.innerText : 'Нет заголовка',
          releaseDate: columns[2].innerText,
          price: columns[3].innerText,
          scoreRank: columns[4].innerText,
          owners: columns[5].innerText,
          playtime: columns[6] ? columns[6].innerText : 'Информация о времени игры отсутствует',
        };
      }).filter(Boolean);
    })) as GameInfo[];
    gameInfo = [...gameInfo, ...newInfo];
    const nextButton = await page.$('.paginate_button.next:not(.disabled) a');
    if (nextButton) {
      await nextButton.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    } else {
      hasNextPage = false;
    }
  }

  await browser.close();
  for (const game of gameInfo) {
    await addGame(game);
  }
  return gameInfo;
}