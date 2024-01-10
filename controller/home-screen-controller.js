require("dotenv").config();
const puppeteer = require("puppeteer");
const utils = require("./utils");

const checkHeader = async (page, errorlog, passLog) => {
  const signuptxt = "Sign up";
  const signUpBtn = await utils.checkButtonvisibilty(page, `Sign up`);
  if (signUpBtn) {
    passLog.push({
      case_id: "HM_TC_01",
      message: "signUp Button visible on header",
    });
  } else {
    errorlog.push({
      case_id: "HM_TC_01",
      message: "signUpBtn Button not visible on header",
    });
  }
  const logInBtn = await utils.checkButtonvisibilty(page, `Log in`);
  if (logInBtn) {
    passLog.push({
      case_id: "HM_TC_01",
      message: "aboutUs button visible on header",
    });
  } else {
    errorlog.push({
      case_id: "HM_TC_01",
      message: "logIn Button not visible on header",
    });
  }
  const sxpath = `//a[contains(text(), 'About Us')]`;
  await page.waitForXPath(sxpath);
  const [aboutUs] = await page.$x(sxpath);
  if (aboutUs) {
    await aboutUs.click();
    passLog.push(
      {
        case_id: "HM_TC_01",
        message: "aboutUs button visible on header",
      },
      {
        case_id: "HM_TC_03",
        message: "aboutUs button visible on header",
      }
    );
  } else {
    errorlog.push({
      case_id: "HM_TC_01",
      message: "aboutUs button not visible on header",
    });
  }
};
const verifySearchBar = async (page, errorlog, passLog) => {
  try {
    const searchbartext = await page.$$eval(`main > *`, (childElements) => {
      return childElements.map((childElement) => {
        return {
          name: childElement.tagName.toLowerCase(),
          value: childElement.innerText,
        };
      });
    });
    const searchfield = [
      "Where to?",
      "Check-in",
      "Check out",
      "Guests",
      "Search Button",
    ];
    let existMenu = [];
    let notExistMenu = [];
    searchfield.map((search) => {
      const match = searchbartext.some((obj) => obj.value.includes(search));
      if (match) {
        existMenu.push(search);
      } else {
        notExistMenu.push(search);
      }
    });
    if (existMenu.length === searchfield.length) {
      passLog.push({
        case_id: "HM_TC_06",
        message: `The below Fields should be displayed on the Search Bar. ${existMenu.toString()} `,
      });
    } else {
      errorlog.push({
        case_id: "HM_TC_06",
        message: `The below Fields should be displayed on the Search Bar. ${notExistMenu.toString()} `,
      });
    }

    const textBoxSelector = 'input[type="search"]';
    await page.waitForSelector(textBoxSelector);
    await page.$eval(textBoxSelector, (textBox) => (textBox.value = ""));
    var textToEnter = "Seattle";
    await page.type(textBoxSelector, textToEnter, { delay: 100 });
    await utils.sleep(3000);
    const firstChildSelector = "ul:first-child";

    await page.waitForSelector(firstChildSelector);
    await page.click(firstChildSelector);
    errorlog.push({
      case_id: "HM_TC_07",
      message: `The below Fields should be displayed on the Search Bar. ${notExistMenu.toString()} `,
    });
  } catch (error) {
    throw error;
  }
};
exports.homePage = async (page, errorLog = [], passLog = []) => {
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  // });
  // const page = await browser.newPage();
  // await page.goto("https://uat.whimstay.com/");
  // await page.setViewport({ width: 1080, height: 864 });
  await checkHeader(page, errorLog, passLog); // test-case-1
  await page.goto("https://uat.whimstay.com/");
  await verifySearchBar(page, errorLog, passLog);
  return {
    errorLog: errorLog,
    passLog: passLog,
  };
};
// homePage();
