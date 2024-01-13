import puppeteer from 'puppeteer';
import { Url, Password, Email } from '../config/env';

let page: any;
let imgLinks: string[] = [];

export async function startBrowserAndLogin() {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'
    });
    page = await browser.newPage();

    await page.goto(Url);
    await new Promise(r => setTimeout(r, 10000));

    await page.type('input[name="email"]', Email);
    await new Promise(r => setTimeout(r, 2000));
    await page.type('input[name="password"]', Password);
    await new Promise(r => setTimeout(r, 2000));
    await page.click('button[type="submit"]');

    await page.waitForNavigation();
}

export async function automateDiscordMessaging(message: string) {
    await new Promise(r => setTimeout(r, 10000));
    await page.click('div[data-slate-node="element"]');
    await page.keyboard.type('/genie ');
    await new Promise(r => setTimeout(r, 2000));
    await page.keyboard.type(` ${message}`);
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 5000));

    const mentionedMessages = await page.$$('.message__80c10.cozyMessage__64ce7.mentioned__58017');
    const lastMessage = mentionedMessages[mentionedMessages.length - 1];
    let link = null;
    if (lastMessage) {
        const seed = await lastMessage.$eval('blockquote span:nth-child(4)', (el: Element) => el.textContent);
        console.log(`Seed: ${seed}`);
        await new Promise(r => setTimeout(r, 30000));
        const downloadButton = await lastMessage.waitForSelector('button[role="link"]');
        if (downloadButton) {
            await downloadButton.click();
            await page.waitForSelector('span.text-md-normal__4afad');
                
            link = await page.evaluate(() => {
                const elements = document.querySelectorAll('span.text-md-normal__4afad');
                let textContent = '';
                elements.forEach((element) => {
                    textContent += element.textContent;
                });
                return textContent ? textContent : null;
            });
            if(link){
                link = link.replace('https://', '');
                link = 'https://lumalabs.ai' + link;
                await page.goto(link);
                await page.waitForSelector('div.flex img');
        
                imgLinks = await page.evaluate(() => {
                    const imgs = Array.from(document.querySelectorAll('div.flex img')) as HTMLImageElement[];
                    return imgs.map(img => img.src);
                });
            }
        } else {
            console.log('Ошибка: Кнопка "View / Download" не найдена');
        }        
    } else {
        console.log('Ошибка: Сообщение не найдено');
    }
    return imgLinks;
}