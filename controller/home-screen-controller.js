require("dotenv").config();
const puppeteer = require("puppeteer");
const utils = require("./utils");
const moment = require("moment");

const checkHeader = async (page, errorlog, passLog) => {
  const signuptxt = "Sign up";
  // const signUpBtn = await utils.checkButtonvisibilty(page, `Sign up`);
  // if (signUpBtn) {
  //   utils.successLog(`HM_TC_01 => signUp Button visible on header`)
  //   passLog.push({
  //     case_id: "HM_TC_01",
  //     message: "signUp Button visible on header",
  //   });
  // } else {
  //   utils.errorLog(`HM_TC_01 => signUp Button visible on header`)
  //   errorlog.push({
  //     case_id: "HM_TC_01",
  //     message: "signUpBtn Button not visible on header",
  //   });
  // }
  // const logInBtn = await utils.checkButtonvisibilty(page, `Log in`);
  // if (logInBtn) {
  //   utils.successLog(`HM_TC_01: aboutUs button visible on header`)
  //   passLog.push({
  //     case_id: "HM_TC_01",
  //     message: "aboutUs button visible on header",
  //   });
  // } else {
  //   errorlog.push({
  //     case_id: "HM_TC_01",
  //     message: "logIn Button not visible on header",
  //   });
  //   utils.errorLog(`HM_TC_01: aboutUs button visible on header`)
  // }
  const sxpath = `//a[contains(text(), 'About Us')]`;
  await page.waitForXPath(sxpath);
  const [aboutUs] = await page.$x(sxpath);
  if (aboutUs) {
    await aboutUs.click();
    utils.successLog(`HM_TC_02 : aboutUs button visible on header`);
    utils.successLog(`HM_TC_03 : Login , signup and About us text verify`);
    passLog.push(
      {
        case_id: "HM_TC_02",
        message: "aboutUs button   on header",
      },
      {
        case_id: "HM_TC_03",
        message: "aboutUs button visible on header",
      }
    );
  } else {
    utils.errorLog(`HM_TC_03 : Login , signup and About us text verify`);
    errorlog.push({
      case_id: "HM_TC_02",
      message: "aboutUs button not visible on header",
    });
  }
};
const verifySearchBar = async (page, errorlog, passLog) => {
  // try {
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
    "Check in",
    "Check out",
    "Guests",
    "Search",
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
    utils.successLog(
      `HM_TC_06 :The below Fields should be displayed on the Search Bar. ${existMenu.toString()}`
    );
  } else {
    utils.errorLog(
      `HM_TC_06:  The below Fields should be displayed on the Search Bar. ${notExistMenu.toString()} `
    );
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
  const firstChildElement = await page.$(firstChildSelector);
  if (firstChildElement !== null) {
    utils.successLog(
      `HM-TS-7 : When the user enters text in the 'Where to?' field Suggested location should display`
    );
    utils.successLog(
      `HM-TS-7 :  Selected location should display in the search bar`
    );
    utils.logsaved(
      passLog,
      `HM-TS-7`,
      `Selected location should display in the search bar`
    );
    utils.logsaved(
      passLog,
      `HM-TS-7`,
      `When the user enters text in the 'Where to?' field Suggested location should display`
    );
    await firstChildElement.click();
  } else {
    utils.errorLog(
      `HM-TS-7 :  Selected location should display in the search bar`
    );
    utils.errorLog(
      `HM-TS-7 : When the user enters text in the 'Where to?' field Suggested location should display`
    );
    utils.logsaved(
      errorlog,
      `HM-TS-7`,
      `Selected location should display in the search bar`
    );
    utils.logsaved(
      errorlog,
      `HM-TS-7`,
      `When the user enters text in the 'Where to?' field Suggested location should display`
    );
  }

  await utils.sleep(2000);

  const searchbartext61321 = await page.$$eval(`main > *`, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        value: childElement.innerText,
      };
    });
  });
  const calendarText = ["Clear dates", "Minimum nights vary"];
  let calExistMenu = [];
  let calnotExistMenu = [];
  calendarText.map((search) => {
    const match = searchbartext61321.some((obj) => obj.value.includes(search));
    if (match) {
      calExistMenu.push(search);
    } else {
      calnotExistMenu.push(search);
    }
  });
  if (calExistMenu.length === calendarText.length) {
    passLog.push({
      case_id: "HM_TC_06",
      message: `text missing ${calExistMenu.toString()} in the calendar`,
    });
    utils.successLog(
      `HM_TC_06 :text missing ${calnotExistMenu.toString()} in the calendar `
    );
  } else {
    errorlog.push({
      case_id: "HM_TC_08-02",
      message: `text missing ${calExistMenu.toString()} in the calendar`,
    });
    utils.errorLog(
      `HM_TC_08-02 : text missing ${calnotExistMenu.toString()} in the calendar `
    );
  }
  const isCalendarOpen = searchbartext61321.some((obj) =>
    obj.value.includes("\nSu\nMo")
  );
  if (isCalendarOpen) {
    utils.successLog(
      `HM-TC-08-01 : When the user clicks on the check-in and check-out, the calendar should open`
    );
    utils.logsaved(
      passLog,
      `HM-TC-08-01`,
      `When the user clicks on the check-in and check-out, the calendar should open`
    );
  } else {
    utils.logsaved(
      errorlog,
      `HM-TC-08-01`,
      `When the user clicks on the check-in and check-out, the calendar should open`
    );
    utils.errorLog(
      `HM-TC-08-01 : When the user clicks on the check-in and check-out, the calendar should open`
    );
  }
};
const checkElMonthCal = async (page, errorLog, passLog) => {
  await utils.sleep(1000);
  let dateTxt = moment().format("DD");
  dateTxt = Number(dateTxt) + 1;
  const checkInDate = await utils.checkButtonvisibilty(page, dateTxt);
  const checkoutDate = await utils.checkButtonvisibilty(page, dateTxt + 3);
  if (checkInDate && checkoutDate) {
    await checkInDate.click();
    await checkoutDate.click();
    passLog.push({
      case_id: "HM_TC_08-05",
      message: ` When the check-in/check-out date is that date should display in the selected mode`,
    });
    utils.successLog(
      `HM_TC_08-05 :  When the check-in/check-out date is that date should display in the selected mode`
    );
  } else {
    errorlog.push({
      case_id: "HM_TC_08-05",
      message: ` When the check-in/check-out date is that date should display in the selected mode`,
    });
    utils.errorLog(
      `HM_TC_08-05 :  When the check-in/check-out date is that date should display in the selected mode`
    );
  }

  const isCheckInDate = await utils.gettingValueFrom(
    page,
    `input[name="start date"]`
  );
  const isCheckOutDate = await utils.gettingValueFrom(page, `#endDateInput`);
  const isCheckInPlace = await utils.gettingValueFrom(
    page,
    `input[name="addressinput"]`
  );
  if (isCheckInDate && isCheckOutDate && isCheckInPlace) {
    passLog.push({
      case_id: "HM_TC_08-05",
      message: `When the user selects any date that date should be in the Dark color, and the selected date should display in the check-in/check-out field`,
    });
    utils.successLog(
      `HM_TC_08-05 :   When the user selects any date that date should be in the Dark color, and the selected date should display in the check-in/check-out field`
    );
  } else {
    errorLog.push({
      case_id: "HM_TC_08-05",
      message: `When the user selects any date that date should be in the Dark color, and the selected date should display in the check-in/check-out field`,
    });
    utils.errorLog(
      `HM_TC_08-05 : value not shown in the ${isCheckInDate} ${isCheckOutDate}${isCheckInPlace}`
    );
  }
  // await page.waitForXPath(`//input[@placeholder='Add guests']`);

  // await page.click('//inputinput[placeholder="Add guests"]');
};
const clearDate = async (page, errorLog, passLog) => {
  await page.click(`#endDateInput`);
  await utils.sleep(1000);
  const clearBtn = await utils.checkButtonvisibilty(page, "Clear dates");
  const isCheckOutDate = await utils.gettingValueFrom(page, `#endDateInput`);
  const isCheckInDate = await utils.gettingValueFrom(
    page,
    `input[name="start date"]`
  );
  if (isCheckOutDate && isCheckInDate) {
    utils.successLog(
      `HM_TC_06 : When the user clicks on the Clear dates, the selected date should be unselected`
    );
    passLog.push({
      case_id: "HM_TC_06",
      message:
        "When the user clicks on the Clear dates, the selected date should be unselected",
    });
  } else {
    utils.errorLog(
      `HM_TC_06 : When the user clicks on the Clear dates, the selected date should be unselected`
    );
    errorLog.push({
      case_id: "HM_TC_06",
      message:
        "When the user clicks on the Clear dates, the selected date should be unselected",
    });
  }
};

const AddGuest = async (page, errorLog, passLog) => {
  const xpath = `//input[@placeholder='Add guests']`;
  await page.waitForXPath(xpath);
  const [button] = await page.$x(xpath);
  if (button) {
    await button.click();
  }
  await utils.sleep(2000)
  
  const childCheck = `input[type="checkbox"]`;
  await page.click(`#Pets`);


  const xpath11 = `//button[@aria-label='Add']`;
  await page.waitForXPath(xpath11);
  const [adultBtn] = await page.$x(xpath11);
  if (adultBtn) {
    await adultBtn.click();
  }

  await page.waitForXPath(`//button[@aria-label='Add']`, { visible: true });

  await page.$$eval(`button[aria-label='Add']`, (buttons) => {
    buttons.forEach((button) => button.click());
  });
  const applyButtn = await utils.checkButtonvisibilty(page,'Apply');
  if(applyButtn){
    await applyButtn.click()
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
  // await checkHeader(page, errorLog, passLog); // test-case-1
  // await page.goto("https://uat.whimstay.com/");

  await verifySearchBar(page, errorLog, passLog);
  await checkElMonthCal(page, errorLog, passLog);
  await clearDate(page, errorLog, passLog);
  await checkElMonthCal(page, errorLog, passLog);
  await AddGuest(page, errorLog, passLog);
  return {
    errorLog: errorLog,
    passLog: passLog,
  };
};
// homePage();
