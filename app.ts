import { existsSync, mkdirSync, writeFileSync } from "fs";
import puppeteer from "puppeteer";
import { getItemsWorkshop } from "./helpers/getItemsWorkshop";

const steamScrapper = async() => {
    // @ts-ignore
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
   
    const data = await getItemsWorkshop({ page });
    
    return data;
}


const timeStart = new Date().getTime();

steamScrapper().then( data => {
    writeFileSync("./data/items.json", JSON.stringify( data ), "utf-8")

    const ms = new Date().getTime() - timeStart;
    const min = Math.floor((ms/1000/60) << 0);
    const sec = Math.floor((ms/1000) % 60);
    console.log(`Time to finish: ${min + ':' + sec}`);

    process.exit()
})