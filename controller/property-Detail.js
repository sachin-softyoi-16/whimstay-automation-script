require("dotenv").config();
const puppeteer = require("puppeteer");
const utils = require("./utils");
const moment = require("moment");
const { searchProperty } = require("./home-screen-controller");

const detailPageNav = async (page, errorLog, passLog, testCast, title) => {
    try {
        const findHeading = await utils.findText(
            page,
            `//div//article`
        );
        if (findHeading) {
            await findHeading.click()
            utils.logsaved(passLog, `${testCast}`, `${title}  visible`)
            utils.successLog(`${testCast} :${title}  visible`);
        } else {
            utils.logsaved(errorLog, `${testCast}`, `${title}  visible`)
            utils.errorLog(`${testCast} :${title}  not visible`);
            return;
        }
    } catch (error) {
        console.log(error)
    }
}

const detailScreenVerification = async (page, errorLog, passLog, testCast, title) => {
    try {
        const findHeading = await utils.findText(
            page,
            `//a[contains(text(), 'View all properties in ')]`
        );
        if (findHeading) {
            utils.logsaved(passLog, `${testCast}-01`, `${title}  visible`)
            utils.successLog(`${testCast}-01 :${title}  visible`);
        } else {
            utils.logsaved(errorLog, `${testCast}-01`, `${title}  visible`)
            utils.errorLog(`${testCast}-01 :${title}  not visible`);
            return;
        }

        const xpath11 = `//button[@aria-label='share property']`;
        await page.waitForXPath(xpath11);
        const [shareBtn] = await page.$x(xpath11);
        const [favBtn] = await page.$x(`//button[@aria-label='Options']`);
        if (shareBtn && favBtn) {
            utils.logsaved(passLog, `${testCast}-01-01`, `${title} share button should be visible`)
            utils.successLog(`${testCast}-01-01 :${title} share button should be visible`);
        } else {
            utils.logsaved(errorLog, `${testCast}-01-01`, `${title} share button not visible`)
            utils.errorLog(`${testCast}-01-01 :${title} share button not visible`);
        }
        const images = await utils.getImageVisibility(page);
        if (images) {
            utils.logsaved(passLog, `${testCast}-02-02`, `${title} share button should be visible`)
            utils.successLog(`${testCast}-02-02 :${title} share button should be visible`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-02`, `${title} share button not visible`)
            utils.errorLog(`${testCast}-02-02 :${title} share button not visible`);
        }
        const propertyName = await utils.getTextFromTag(page, 'h1');
        if (propertyName) {
            utils.logsaved(passLog, `${testCast}-02-03`, `Property name should be visible`)
            utils.successLog(`${testCast}-02-03 :Property name should be visible`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-03`, `Property name not visible`)
            utils.errorLog(`${testCast}-02-03 :Property name not visible`);
        }
        if (propertyName) {
            utils.logsaved(passLog, `${testCast}-02-04`, `Location, Rating should be visible`)
            utils.successLog(`${testCast}-02-04 :Location, Rating should be visible`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-04`, `Location, Rating not visible`)
            utils.errorLog(`${testCast}-02-04 :Location, Rating not visible`);
        }

        const location = await utils.getTextFromTag(page, 'h2');
        // const Rating = await utils.getTextFromTag1(page, '//a//span');

        const getPageText = await page.waitForXPath(`//h1[contains(text(), '${propertyName}')]`);
        // Get the grandparent div's class name
        const allText = await page.evaluate((element) => {
            const grandparentDiv = element.closest("body")?.parentNode;
            // Return an object with class name and data from two child elements
            if (grandparentDiv) {
                const className = grandparentDiv.classList.value;
                const link =
                    grandparentDiv.querySelector("a ")?.href;
                const locationRating =
                    grandparentDiv.querySelector('.gap-x-8 ')?.innerText;
                const childData2 =
                    grandparentDiv.querySelector('.mt-2  ')?.innerText;
                const cancelPolicy =
                    grandparentDiv.querySelector('.cancelation-popover ')?.innerText;

                const trst1 =
                    grandparentDiv.querySelector('.flex-grow-0 ')?.innerText;
                const priceSavePrice =
                    grandparentDiv.querySelector('.items-baseline ')?.innerText;
                const description =
                    grandparentDiv.querySelector('.defaultStyleSheet ')?.innerText;
                const sleepingArrange =
                    grandparentDiv.querySelector('#where_you_will_be_section ')?.innerText;
                const aminities =
                    grandparentDiv.querySelector('#where_you_will_be_section ')?.innerText;
                return {
                    className, link, childData2, locationRating, cancelPolicy, trst1, priceSavePrice,
                    description
                };
            }
            return null;
        }, getPageText);
        const textList = allText.trst1.split('\n');
        if (allText?.locationRating) {
            utils.logsaved(passLog, `${testCast}-02-04`, `Location, Rating should be visible`)
            utils.successLog(`${testCast}-02-04 :Location, Rating should be visible`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-04`, `Location, Rating not visible`)
            utils.errorLog(`${testCast}-02-04 :Location, Rating not visible`);
        }

        if (allText?.childData2 && allText?.cancelPolicy) {
            utils.logsaved(passLog, `${testCast}-02-05`, `Guest, Bedroom, Bathroom, Pet Friendly, and Free Cancelation should be display`)
            utils.successLog(`${testCast}-02-05 :Guest, Bedroom, Bathroom, Pet Friendly, and Free Cancelation should be display`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-04`, `Guest, Bedroom, Bathroom, Pet Friendly, and Free Cancelation not visible`)
            utils.errorLog(`${testCast}-02-04 :Guest, Bedroom, Bathroom, Pet Friendly, and Free Cancelation not visible`);
        }

        if (allText?.priceSavePrice) {
            utils.logsaved(passLog, `${testCast}-02-06`, `Check Availability (Property ID, Rating, Price, and Save Price) should be display`)
            utils.successLog(`${testCast}-02-06 :Check Availability (Property ID, Rating, Price, and Save Price) should be display`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-06`, `Check Availability (Property ID, Rating, Price, and Save Price) not visible`)
            utils.errorLog(`${testCast}-02-06 :Check Availability (Property ID, Rating, Price, and Save Price) not visible`);
        }


        if (allText?.description) {
            utils.logsaved(passLog, `${testCast}-02-07`, `About this space should be display`)
            utils.successLog(`${testCast}-02-07 : About this space should be display`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-07`, `About this space not visible`)
            utils.errorLog(`${testCast}-02-07 : About this space not visible`);
        }

        if (allText.trst1.includes(`Where you'll sleep`)) {
            utils.logsaved(passLog, `${testCast}-02-08`, `Sleeping Arrangements should be display`)
            utils.successLog(`${testCast}-02-08 : Sleeping Arrangements should be display`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-08`, `Sleeping Arrangements not visible`)
            utils.errorLog(`${testCast}-02-08 : Sleeping Arrangements not visible`);
        }

        if (allText.trst1.includes(`What this place offers`)) {
            utils.logsaved(passLog, `${testCast}-02-09`, `What this place offers should be display`)
            utils.successLog(`${testCast}-02-089: What this place offers should be display`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-09`, `What this place offers not visible`)
            utils.errorLog(`${testCast}-02-089: What this place offers not visible`);
        }

        if (allText.trst1.includes(`Guest Reviews`)) {
            utils.logsaved(passLog, `${testCast}-02-11`, `Guest Reviews should be display`)
            utils.successLog(`${testCast}-02-11 : Guest Reviews should be display`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-11`, `Guest Reviews not visible`)
            utils.errorLog(`${testCast}-02-11 : Guest Reviews not visible`);
        }


        const mapSelector = 'iframe';
        await page.waitForSelector(mapSelector);
        const isMapVisible = await page.evaluate((selector) => {
            const mapElement = document.querySelector(selector);
            const style = getComputedStyle(mapElement);
            return style.display !== 'none' && style.visibility !== 'hidden';
        }, mapSelector);

        if (isMapVisible) {
            utils.logsaved(passLog, `${testCast}-02-10`, `The map is visible`)
            utils.successLog(`${testCast}-02-10 : The map is visible`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-10`, `The map not visible`)
            utils.errorLog(`${testCast}-02-10 : The map not visible`);
        }



        if (allText.trst1.includes(`Things to know`)) {
            utils.logsaved(passLog, `${testCast}-02-12`, `House rules and Health & Safety should be display`)
            utils.successLog(`${testCast}-02-12 : House rules and Health & Safety should be display`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-12`, `House rules and Health & Safety not visible`)
            utils.errorLog(`${testCast}-02-12 : House rules and Health & Safety not visible`);
        }

        if (allText.trst1.includes(`Explore nearby destinations`)) {
            utils.logsaved(passLog, `${testCast}-02-13`, `Explore Nearby destinations should be display`)
            utils.successLog(`${testCast}-02-13 : Explore Nearby destinations should be display`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-13`, `Explore Nearby destinations not visible`)
            utils.errorLog(`${testCast}-02-13 : Explore Nearby destinations not visible`);
        }

        if (allText.trst1.includes(`Explore nearby destinations`)) {
            utils.logsaved(passLog, `${testCast}-02-14`, `Explore nearby properties(After date selection) should be display`)
            utils.successLog(`${testCast}-02-14 : Explore nearby properties(After date selection) should be display`);
        } else {
            utils.logsaved(errorLog, `${testCast}-02-14`, `Explore nearby properties(After date selection) not visible`)
            utils.errorLog(`${testCast}-02-14 : Explore nearby properties(After date selection) not visible`);
        }
    } catch (error) {
        console.log(error)
    }
}
const shareModel = async (page, errorLog, passLog, testCast, title) => {
    try {
        const xpath11 = `//button[@aria-label='share property']`;
        await page.waitForXPath(xpath11);
        const [shareBtn] = await page.$x(xpath11);
        if (shareBtn) {
            await shareBtn.click();
            await utils.sleep(5000);
            const textElementHandle = await page.waitForXPath(`//button[contains(text(), 'Copy')]`);
            // Get the grandparent div's class name
            const isModelDetail = await page.evaluate((element) => {
                const grandparentDiv = element.closest("div")?.parentNode;
                // Return an object with class name and data from two child elements
                if (grandparentDiv) {
                    const className = grandparentDiv.classList.value;
                    const link =
                        grandparentDiv.querySelector('input')?.value;
                    return { className, link };
                }
                return null;
            }, textElementHandle);

            if (isModelDetail.link) {
                const [btn] = await page.$x(`//button[contains(text(), 'Copy')]`);
                if (btn) {
                    await btn.click()
                    utils.logsaved(passLog, `${testCast}`, `Property Share Link visible and Copy button click`)
                    utils.successLog(`${testCast} :${title}  Property Share Link visible and Copy button click`);

                    await utils.sleep(1000);

                    return isModelDetail.link;
                }
            } else {
                utils.logsaved(errorLog, `${testCast}`, `Property Share Link not visible`)
                utils.errorLog(`${testCast} :${title}  Property Share Link not visible`);
            }
            console.log(isModelDetail)
        }
    } catch (error) {
        console.log(error)
    }
}
const shareLinkOpen = async (link, errorLog, passLog, testCast, browser) => {
    try {
        const newPage = await browser.newPage();
        await newPage.goto(link);
        await newPage.setViewport({ width: 1536, height: 864 });
        utils.logsaved(passLog, `${testCast}`, `Redirect to property detail page`)
        utils.successLog(`${testCast} : Redirect to property detail page`);
        await utils.sleep(2000);
        await newPage.close();

    } catch (error) {
        console.log(error)
        utils.logsaved(error, `${testCast}`, `Redirect not working`)
        utils.errorLog($`{testCast} : Redirect not working`);
    }
}
exports.detailPage = async (page = '', errorLog = [], passLog = []) => {
    try {

        const browser = await puppeteer.launch({
            headless: false,
            executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        });
        page = await browser.newPage();
        await page.goto("https://uat.whimstay.com/vacation-rentals/Gatlinburg--Tennessee--USA");
        await page.waitForTimeout(1000); // Wait for some time to ensure the page is loaded
        await page.setViewport({ width: 1536, height: 864 });
        await utils.removeFunction(page);
        // await searchProperty(page, errorLog, passLog)
        await detailPageNav(page, errorLog, passLog, 'PD_TC_01', 'Property detail');
        await utils.sleep(3000)
        const pagesList = await browser.pages();
        const newPage = pagesList[pagesList.length - 1];
        // await newPage.goto('https://uat.whimstay.com/detail/Splash-Mountain-Lodge-Play-games-splash-in-your-private-indoor-pool/d1568696f906bfcbf22dec4af2170e5b?name=Sevierville%2C+Tennessee%2C+USA&check_in=2024-06-06&check_out=2024-05-08&adultsCount=1&childrenCount=0&suitablePet=false&timestamp=1705917431019')
        await newPage.setViewport({ width: 1536, height: 864 });
        await detailScreenVerification(newPage, errorLog, passLog, 'PD_TC_02', 'Property detail');
        const modelRes = await shareModel(newPage, errorLog, passLog, 'PD_TC_03', 'Property share model');
        await shareLinkOpen(modelRes, errorLog, passLog, 'PD_TC_04', browser);
    } catch (error) {
        console.log(error)
    }
}
this.detailPage()