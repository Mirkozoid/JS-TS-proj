import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { NewMessage } from "telegram/events";
import { ApiHash, ApiID, StringConect, Token } from "../config/env";
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
const input = require('input');

const apiId = Number(ApiID);
const apiHash = ApiHash;
const stringSession = new StringSession(StringConect);

export async function autoTonBot() {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });// тут поставить вместо stringSession новую пустую строку подключения и тогда уже ввести аккаунт пустышку чтобы получить строку

    await client.start({
        phoneNumber: async () => await input.text("Введите ваш номер: "),
        password: async () => await input.text("Введите ваш пароль: "),
        phoneCode: async () => await input.text("Введите код, который вы получили: "),
        onError: (err) => console.log(err),
    });
    console.log("start");
    const sessionString = client.session.save();
    while (true) {
        const message = await client.sendMessage("@testgiver_ton_bot", { message: "/get" });
        client.addEventHandler(async (event) => {
            if (event.isPrivate && event.message.media) {
                const file = await client.downloadMedia(event.message.media);
                if(file){
                    fs.writeFileSync('captcha.jpg', file);
                    console.log(fs.existsSync('captcha.jpg'))
                    console.log(fs.statSync('captcha.jpg').size)
                }
                const formData = new FormData();
                formData.append('key', Token);
                if(file){
                    const base64File = file.toString('base64');
                    const dataUrl = 'data:image/jpeg;base64,' + base64File;
                    if (dataUrl != undefined) {
                        formData.append('body', dataUrl);
                    }              
                    formData.append('method', 'base64');
                    formData.append('json', '1');
                    let response = await axios.post('https://2captcha.com/in.php', formData, {
                        headers: formData.getHeaders()
                    });
                    let captchaId = response.data.request;
                    let isSolved = false;
                    while (!isSolved) {
                        response = await axios.get(`https://2captcha.com/res.php?key=${Token}&action=get&id=${captchaId}`);
                        const responseData = response.data.split('|');
                        if (responseData[0] === 'OK') {
                            isSolved = true;
                            console.log('Расшифровка CAPTCHA:', responseData[1]);
                            const captchaResponse = await client.sendMessage("@testgiver_ton_bot", { message: responseData[1] });
                            if (event.isPrivate && event.message.media) {
                                return;
                            } else {
                                const walletResponse = await client.sendMessage("@testgiver_ton_bot", { message: "UQD2MBkPb83l-rtAkmUIPdIe11I0keI9bxkncNE7ul_P1wRh" });
                                await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000));
                            }
                        } else {
                            await new Promise(resolve => setTimeout(resolve, 5000));
                            console.log(captchaId);
                            console.log(response.data.status);
                        }
                    }
                }  
            }
        }, new NewMessage({}));
        await new Promise(resolve => setTimeout(resolve, 10000));        
    }        
}