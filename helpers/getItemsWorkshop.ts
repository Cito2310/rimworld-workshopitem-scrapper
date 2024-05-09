import { Page } from "puppeteer";

interface props {
    page: Page;
}

export const getItemsWorkshop = async({ page }: props) => {
    const createURL = ( page: number ) => `https://steamcommunity.com/workshop/browse/?appid=294100&searchtext=&childpublishedfileid=0&browsesort=totaluniquesubscribers&section=readytouseitems&requiredtags%5B0%5D=Mod&requiredtags%5B1%5D=1.5&created_date_range_filter_start=0&created_date_range_filter_end=0&updated_date_range_filter_start=0&updated_date_range_filter_end=0&actualsort=totaluniquesubscribers&p=${page}`

    const allItemsWorkshop = [];
    let currentPage = 0;
    let currentItemsWorkshop;

    do {
        currentItemsWorkshop = []
        currentPage++;

        console.log(currentPage )

        await page.goto( createURL( currentPage ) );

        // VERIFY EXIST ITEMS IN CURRENT PAGE
        try {
            await page.$eval(".inventory_msg_content ", div=> div.textContent ) // intentara encontrar la advertencia de que no hay mas items
            // al no haber mas items se rompera el bucle
            break;

        } catch (error) { // $eval provocara un error si no es encuentra el mensaje, activando esta parte
            // no se hace nada y se continua el codigo
        }

        // CONTINUA EL CODIGO
        await page.waitForSelector(".workshopBrowseItems", { timeout: 7000 });
        
        const dataItemsPage: DataItem[] = await page.evaluate(() =>{
            const workshopItems = Array.from(document.querySelectorAll(".workshopItem"));

            let dataItems: DataItem[] = [];
            workshopItems.forEach(( item, index ) => {
                const title = item.querySelector(".item_link")?.textContent as string;
                const url = item.querySelector(".item_link")?.getAttribute("href") as string;
                const author = item.querySelector(".workshop_author_link")?.textContent as string;
                const imageUrl = item.querySelector(".workshopItemPreviewImage")?.getAttribute("src") as string;
                const popularityTop = 0;

                dataItems.push({ title, url, author, imageUrl, popularityTop })
            })

            return dataItems;
        })

        currentItemsWorkshop.push( ...dataItemsPage );
        allItemsWorkshop.push( ...dataItemsPage );

    // } while ( (currentItemsWorkshop.length !== 0) && currentPage <= 4 || false ) // limiter
    } while ( currentItemsWorkshop.length !== 0 || false )

    // return items and add popularityTop
    return allItemsWorkshop.map(( item, index ) => ({...item, popularityTop: index+1}) )
}