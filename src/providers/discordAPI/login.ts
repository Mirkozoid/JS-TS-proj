import { getFreeBrowser, releaseBrowser, POOL_SIZE } from './browserPool';
import { Email, Password, Url } from '../../config/env';

export async function login(page: any) {
    await page.goto(Url);
        console.log('Переход по URL выполнен');
        await new Promise(r => setTimeout(r, 10000));

        await page.type('input[name="email"]', Email);
        console.log('Введен email');
        await new Promise(r => setTimeout(r, 2000));
        await page.type('input[name="password"]', Password);
        console.log('Введен пароль');
        await new Promise(r => setTimeout(r, 2000));
        await page.click('button[type="submit"]');
        console.log('Нажата кнопка входа');

        await page.waitForNavigation();
        console.log('Навигация завершена');
}