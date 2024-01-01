import puppeteer from 'puppeteer';
import { Url } from '../config/env';
import { addUpcomigGameInfo } from '../providers/addingUserToDB'; // замените на путь к вашему файлу с функцией addUpcomigGameInfo

interface GameInfo {
  title: string;
  developer: string;
  publisher: string;
  genre: string;
  followers: string;
  releaseDate: string;
  owners: string;
}
export async function getUpcomingGameInfo(): Promise<(GameInfo | null)[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(Url);
  const gameInfos: (GameInfo | null)[] = await page.$$eval('div.widget-11', elements => elements.map(element => {
    const titleElement = element.querySelector('h3');
    if (!titleElement) {
      return null;
    }
    const title = titleElement.textContent || 'Нет заголовка';
    const developer = Array.from(element.querySelectorAll('strong')).find(el => el.innerText.startsWith('Developer:'))?.nextElementSibling?.textContent || 'Нет информации о разработчике';
    const publisher = Array.from(element.querySelectorAll('strong')).find(el => el.innerText.startsWith('Publisher:'))?.nextElementSibling?.textContent || 'Нет информации об издателе';
    const genreElement = Array.from(element.querySelectorAll('strong')).find(el => el.innerText.startsWith('Genre:'));
    let nextStrongElement = genreElement?.nextElementSibling;
    let genreElements: Element[] = [];
    while (nextStrongElement && nextStrongElement.tagName.toLowerCase() !== 'strong') {
      if (nextStrongElement.tagName.toLowerCase() === 'a') {
        genreElements.push(nextStrongElement);
      }
      nextStrongElement = nextStrongElement.nextElementSibling;
    }
    const genre = genreElements.map(a => a.textContent).join(', ') || 'Нет информации о жанре';
    const followers = Array.from(element.querySelectorAll('strong')).find(el => el.innerText.startsWith('Followers:'))?.nextSibling?.textContent?.trim() || 'Нет информации о подписчиках';
    const releaseDate = Array.from(element.querySelectorAll('strong')).find(el => el.innerText.startsWith('Release date'))?.nextSibling?.textContent?.trim() || 'Нет информации о дате выпуска';
    const owners = Array.from(element.querySelectorAll('strong')).find(el => el.innerText.startsWith('Owners'))?.nextSibling?.textContent?.trim() || 'Нет информации о владельцах';
    return { title, developer, publisher, genre, followers, releaseDate, owners };
  }));
  const validGameInfos: GameInfo[] = gameInfos.filter(Boolean) as GameInfo[];
  await browser.close();
  for (const gameInfo of validGameInfos) {
    await addUpcomigGameInfo(gameInfo);
  }
  return validGameInfos;
}