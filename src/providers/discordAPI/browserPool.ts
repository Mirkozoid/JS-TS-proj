import puppeteer from 'puppeteer';
import { login } from './login';

export const POOL_SIZE = 2;
let browsers: any[] = [];

export async function createBrowserPool() {
    for (let i = 0; i < POOL_SIZE; i++) {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(300000);
        await login(page);
        browsers.push({ browser, page, isBusy: false });
    }
    console.log(`Успешно выполнен вход в ${POOL_SIZE} аккаунтов Discord`);
}

export function getFreeBrowser() {
    for (let i = 0; i < POOL_SIZE; i++) {
        if (!browsers[i].isBusy) {
            browsers[i].isBusy = true;
            return browsers[i];
        }
    }
    return null;
}

export function releaseBrowser(browser: any) {
    const index = browsers.indexOf(browser);
    if (index > -1) {
        browsers[index].isBusy = false;
    }
}