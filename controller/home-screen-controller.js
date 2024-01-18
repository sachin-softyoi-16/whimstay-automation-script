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
  await utils.sleep(2000);

  const searchbartext = await page.$$eval(`section > *`, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        value: childElement.innerText,
      };
    });
  });
  const guestBoxText = [
    "Adults",
    "Ages 13 or above",
    "Children",
    "Ages 2-12",
    "Pets",
    "Are pets allowed?",
    "Clear",
    "Apply",
  ];
  let existMenu = [];
  let notExistMenu = [];
  guestBoxText.map((search) => {
    const match = searchbartext.some((obj) => obj.value.includes(search));
    if (match) {
      existMenu.push(search);
    } else {
      notExistMenu.push(search);
    }
  });
  if (existMenu.length === guestBoxText.length) {
    passLog.push({
      case_id: "HM_TC_09",
      message: `The below Fields should be displayed on the add guest popup. ${existMenu.toString()} `,
    });
    utils.successLog(
      `HM_TC_09 :The below Fields should be displayed on the add guest popup. ${existMenu.toString()}`
    );
  } else {
    utils.errorLog(
      `HM_TC_06:  The below Fields should be displayed on the add guest popup. ${notExistMenu.toString()} `
    );
    errorlog.push({
      case_id: "HM_TC_06",
      message: `The below Fields should be displayed on the add guest popup. ${notExistMenu.toString()} `,
    });
  }

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
  const applyButtn = await utils.checkButtonvisibilty(page, "Apply");
  if (applyButtn) {
    await applyButtn.click();
  }
};

const featureDeal = async (page, errorLog, passLog) => {
  const findHeading = await utils.findText(
    page,
    `//h2[contains(text(), 'Featured last-minute deals')]`
  );
  if (findHeading) {
    passLog.push({
      case_id: "HM_TC_11",
      message: `Featured last-minute deals section not visible`,
    });
    utils.successLog(
      `HM_TC_11 :Featured last-minute deals section not visible`
    );
  } else {
    errorLog.push({
      case_id: "HM_TC_11",
      message: `Featured last-minute deals section not visible`,
    });
    utils.errorLog(`HM_TC_11 :Featured last-minute deals section not visible`);
  }
  const searchbartext = await page.$$eval(`article > *`, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        value: childElement.innerText,
      };
    });
  });
  const isSaveButton = searchbartext.some((obj) => obj.value.includes(`Save`));
  if (isSaveButton) {
    passLog.push({
      case_id: "HM_TC_12-01",
      message: `Save price tag dispaly.`,
    });
    utils.successLog(`HM_TC_12-01 :Save price tag dispaly.`);
  } else {
    passLog.push({
      case_id: "HM_TC_12-01",
      message: `Save price tag not dispaly.`,
    });
    utils.successLog(`HM_TC_12-01 :Save price tag not dispaly.`);
  }
  try {
    await page.waitForSelector(`.slick-active  > div > img`, { visible: true });
    console.log("The image is visible.");
    passLog.push({
      case_id: "HM_TC_12-02",
      message: `Property image.`,
    });
    utils.successLog(`HM_TC_12-02 :Property image.`);
  } catch (error) {
    passLog.push({
      case_id: "HM_TC_12-02",
      message: `Property image`,
    });
    utils.successLog(`HM_TC_12-02 :Property image`);
  }

  const favIcon = `//button[@aria-label='Options']`;
  await page.waitForXPath(favIcon);
  const [favIconBtn] = await page.$x(favIcon);
  if (favIconBtn) {
    passLog.push({
      case_id: "HM_TC_12-03",
      message: `Favorite icon (Heart)`,
    });
    utils.successLog(`HM_TC_12-03 :Favorite icon (Heart)`);
  } else {
    errorLog.push({
      case_id: "HM_TC_12-03",
      message: `Favorite icon (Heart)`,
    });
    utils.errorLog(`HM_TC_12-03 :Favorite icon (Heart)`);
  }
  const fivDoct = await page.$$eval(`.slick-dots  > li`, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        childElement: childElement.innerHTML,
      };
    });
  });

  let fivexistMenu = [];
  let notFivExistMenu = [];
  [1, 2, 3, 4, 5].map((search) => {
    const match = searchbartext.some((obj) => obj.value.includes(search));
    if (match) {
      fivexistMenu.push(search);
    } else {
      notFivExistMenu.push(search);
    }
  });

  if (fivexistMenu.length == 5) {
    passLog.push({
      case_id: "HM_TC_12-04",
      message: ` Image 5 Dots`,
    });
    utils.successLog(`HM_TC_12-04 : Image 5 Dots`);
  } else {
    errorLog.push({
      case_id: "HM_TC_12-04",
      message: ` Image 5 Dots`,
    });
    utils.errorLog(`HM_TC_12-04 : Image 5 Dots`);
  }

  const propertLocation = await utils.checkTagAvaibleOrNot(
    page,
    `a.chakra-linkbox__overlay`
  );
  if (propertLocation) {
    passLog.push({
      case_id: "HM_TC_12-05",
      message: `  > Property Location`,
    });
    utils.successLog(`HM_TC_12-05 :  > Property Location`);
  } else {
    errorLog.push({
      case_id: "HM_TC_12-05",
      message: `  > Property Location`,
    });
    utils.errorLog(`HM_TC_12-05 :  > Property Location`);
  }
  // const propertyImage =
  const fillAttribute = await page.$eval("path", (svg) => {
    return (
      svg.getAttribute("d") ===
      `M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z`
    );
  });

  const fiv55Doct = await page.$$eval(`div  > svg`, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        childElement: childElement.innerHTML,
      };
    });
  });

  const rattingBtn = fiv55Doct.some((obj) =>
    obj.childElement.includes(
      `<path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>`
    )
  );
  if (rattingBtn) {
    passLog.push({
      case_id: "HM_TC_12-06",
      message: `Ratings`,
    });
    utils.successLog(`HM_TC_12-06 :Ratings`);
  } else {
    errorLog.push({
      case_id: "HM_TC_12-06",
      message: `Ratings`,
    });
    utils.errorLog(`HM_TC_12-06 :Ratings`);
  }

  let propertyName = await page.$$eval(
    `div > .disable_click`,
    (childElements) => {
      return childElements.map((childElement) => {
        return {
          name: childElement.tagName.toLowerCase(),
          className: childElement.className,
          childElement: childElement.innerText,
        };
      });
    }
  );
  const propertiesName = propertyName.filter(
    (prooperty) =>
      prooperty.className ===
      "disable_click line-clamp-1 py-[1px] text-sm text-[#717171]"
  );
  if (propertiesName.length > 0) {
    passLog.push({
      case_id: "HM_TC_12-07",
      message: `Property Name`,
    });
    utils.successLog(`HM_TC_12-07 :Property Name`);
  } else {
    errorLog.push({
      case_id: "HM_TC_12-07",
      message: `Property Name`,
    });
    utils.errorLog(`HM_TC_12-07 :Property Name`);
  }

  const badRoom = propertyName.some((obj) =>
    obj.childElement.includes("bedrooms")
  );
  const guesRoom = propertyName.some((obj) =>
    obj.childElement.includes("guests")
  );
  const nights = propertyName.some((obj) =>
    obj.childElement.includes("nights")
  );
  if (badRoom && guesRoom) {
    passLog.push({
      case_id: "HM_TC_12-08",
      message: `Bedrooms, Beds, Guests`,
    });
    utils.successLog(`HM_TC_12-08 :Bedrooms, Beds, Guests`);
  } else {
    errorLog.push({
      case_id: "HM_TC_12-08",
      message: `Bedrooms, Beds, Guests`,
    });
    utils.errorLog(`HM_TC_12-08 :Bedrooms, Beds, Guests`);
  }
  if (nights) {
    passLog.push({
      case_id: "HM_TC_12-09",
      message: `Nights and Dates`,
    });
    utils.successLog(`HM_TC_12-09 :Nights and Dates`);
  } else {
    errorLog.push({
      case_id: "HM_TC_12-09",
      message: `Nights and Dates`,
    });
    utils.errorLog(`HM_TC_12-09 :Nights and Dates`);
  }
  let taxes = await page.$$eval(`article > * `, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        className: childElement.className,
        childElement: childElement.innerText,
      };
    });
  });
  taxes = taxes.some((obj) => obj.childElement.includes("total before taxes"));
  if (taxes) {
    passLog.push({
      case_id: "HM_TC_12-10",
      message: `Save price and Total before taxes`,
    });
    utils.successLog(`HM_TC_12-10 :Save price and Total before taxes`);
  } else {
    errorLog.push({
      case_id: "HM_TC_12-10",
      message: `Save price and Total before taxes`,
    });
    utils.errorLog(`HM_TC_12-10 :Save price and Total before taxes`);
  }
};

// string Deals on vacation rentals for groups
const luxuryVacationRentals = async (page, errorLog, passLog, testCast, title, link_title) => {
  try {
    const findHeading = await utils.findText(
      page,
      `//h3[contains(text(), '${title}')]`
    );
    if (findHeading) {
      passLog.push({
        case_id: "${testCast}",
        message: `${title} section not visible`,
      });
      utils.successLog(
        `${testCast} :${title} section not visible`
      );
    } else {
      errorLog.push({
        case_id: "${testCast}",
        message: `${title} section not visible`,
      });
      utils.errorLog(
        `${testCast} :${title} section not visible`
      );
    }
    const xpathExpression = `//h3[contains(text(), '${title}')]`;

    const textElementHandle = await page.waitForXPath(xpathExpression);

    // Get the grandparent div's class name
    const grandparentDivClassName = await page.evaluate((element) => {
      const grandparentDiv = element.closest("div")?.parentNode;

      // Return an object with class name and data from two child elements
      if (grandparentDiv) {
        const className = grandparentDiv.classList.value;
        const childData1 =
          grandparentDiv.querySelector(".child1-selector")?.textContent;
        const childData2 =
          grandparentDiv.querySelector(".hideScrollBar ")?.textContent;

        return { className, childData1, childData2 };
      }

      return null;
    }, textElementHandle);
    const propertiesCount = grandparentDivClassName.childData2
      .split("Total before taxes")
      .filter((n) => n);
    if (propertiesCount.length >= 1 && propertiesCount.length <= 4) {
      passLog.push({
        case_id: `${testCast}-1`,
        message: `${title} section not visible`,
      });
      utils.successLog(
        `${testCast}-1 :${title} section not visible`
      );
    } else {
      errorLog.push({
        case_id: `${testCast}-1`,
        message: `${title} section not visible`,
      });
      utils.errorLog(
        `${testCast}-1 :${title} section not visible`
      );
      return;
    }
    const findLink = await utils.findText(
      page,
      `//a[contains(text(), 'Find deals on ${link_title}')]`
    );
    if (findLink) {
      const previousURL = await page.url();
      await findLink.click();
      passLog.push({
        case_id: `${testCast}-02`,
        message: `Find Deals on ${title} - hyperlink should display`,
      });
      utils.successLog(
        `${testCast}-02 :Find Deals on ${title} - hyperlink should display`
      );
      await utils.sleep(10000);
      const currentURL = await page.url();
      if (previousURL != currentURL) {
        passLog.push({
          case_id: `${testCast}-03`,
          message: `redirection`,
        });
        utils.successLog(
          `${testCast}-03 :redirection`
        );
      } else {
        errorLog.push({
          case_id: `${testCast}-03`,
          message: `redirection`,
        });
        utils.errorLog(
          `${testCast}-03 :redirection`
        );
      }

    } else {
      errorLog.push({
        case_id: "HM_TC_13-02",
        message: `Find Deals on luxury vacation rentals - hyperlink should display`,
      });
      utils.errorLog(
        `HM_TC_13-02 :Find Deals on luxury vacation rentals - hyperlink should display`
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const propertyVerification = async (page, errorLog, passLog) => {
  try {
    let images = await page.$$eval('img', (imgElements) => {
      return imgElements.map((img) => img.src);
    });
    const imageDomain = `https://assets.whimstay.com/`
    images = images.filter((img) => img.startsWith(imageDomain));
    const pmsList = ['8803077', 'cabovillas', 'exceptionalstays', 'movingmountains'];
    let isExist = true;
    for (let i = 0; i < images.length; i++) {
      const imgUrl = images[i].substring(imageDomain.length, images[0].length).split('/')
      isExist = pmsList.some((obj) => obj == imgUrl[0])
      console.log(isExist)
      if (!isExist) {
        errorLog.push({
          case_id: "HM_TC_13-04",
          message: `"CaboVillas, Exceptional Stays, Exclusive 30A, and Moving Mountains" PMC properties should display`,
        });
        utils.errorLog(
          `HM_TC_13-04 :"CaboVillas, Exceptional Stays, Exclusive 30A, and Moving Mountains" PMC properties should display`
        );
        break;
      }
    }
    if (isExist) {
      passLog.push({
        case_id: "HM_TC_13-04",
        message: `"CaboVillas, Exceptional Stays, Exclusive 30A, and Moving Mountains" PMC properties should display`,
      });
      utils.successLog(
        `HM_TC_13-04 :"CaboVillas, Exceptional Stays, Exclusive 30A, and Moving Mountains" PMC properties should display`
      );
    }
  } catch (error) {
    console.log(`propertyVerification`, error)
  }
}

const popularDesitination = async (page, errorLog, passLog, testCast, title) => {
  try {
    const findHeading = await utils.findText(
      page,
      `//h3[contains(text(), '${title}')]`
    );
    if (findHeading) {
      passLog.push({
        case_id: "${testCast}",
        message: `${title} section visible`,
      });
      utils.successLog(
        `${testCast} :${title} section visible`
      );
    } else {
      errorLog.push({
        case_id: `${testCast}`,
        message: `${title} section not visible`,
      });
      utils.errorLog(
        `${testCast} :${title} section not visible`
      );
    }
    const xpathExpression = `//h3[contains(text(), '${title}')]`;

    const textElementHandle = await page.waitForXPath(xpathExpression);

    // Get the grandparent div's class name
    const grandparentDivClassName = await page.evaluate((element) => {
      const grandparentDiv = element.closest("div")?.parentNode;
      // Return an object with class name and data from two child elements
      if (grandparentDiv) {
        const className = grandparentDiv.classList.value;
        const childData1 =
          grandparentDiv.querySelector(".child1-selector")?.textContent;
        const childData2 =
          grandparentDiv.querySelector(".hideScrollBar ")?.textContent;

        return { className, childData1, childData2 };
      }

      return null;
    }, textElementHandle);
    const pattern = /, ([A-Za-z]{2})/g;

    const matches = grandparentDivClassName.childData2.match(pattern);
    const resultArray = matches ? grandparentDivClassName.childData2.trim().split(pattern).filter((n) => n) : [grandparentDivClassName.childData2];

    if (resultArray.length === 4 || resultArray.length === 8) {
      passLog.push({
        case_id: `${testCast}-1`,
        message: `In ${title} section 4 card is visible`,
      });
      utils.successLog(
        `${testCast}-1 :In ${title} section 4 card is visible`
      );
    } else {
      errorLog.push({
        case_id: `${testCast}-1`,
        message: `In ${title} section 4 card is not visible`,
      });
      utils.errorLog(
        `${testCast}-1 :In ${title} section 4 card is not visible`
      );
      return;
    }
    const viewMoreBtn = await utils.findText(
      page,
      `//button[contains(text(), 'View more cities')]`
    );
    if (viewMoreBtn) {
      passLog.push({
        case_id: `${testCast}-2`,
        message: `In ${title} section 4 View more cities button is visible`,
      });
      utils.successLog(
        `${testCast}-2 :In ${title} section 4 View more cities button is visible`
      );
      await viewMoreBtn.click()
      await utils.sleep(2000);
      const childCard = await utils.getParentToChildContent(page, `//h3[contains(text(), '${title}')]`);
      const childCardMatches = childCard.childData2.match(pattern);
      const childProperties = childCardMatches ? childCard.childData2.trim().split(pattern).filter((n) => n) : [childCard.childData2];
      if (childProperties.length === 40) {
        let results = [];
        for (let i = 0; i < childProperties.length; i++) {
          if (i % 2 == 0) {
            if (childProperties[i + 2] === childProperties[i]) {
              console.log(childProperties[i], childProperties[i] + 2)
              results.push(sorted_arr[i]);
            }
          }
        }
        if (results.length > 0) {
          errorLog.push({
            case_id: `${testCast}-04`,
            message: `In ${title} Duplicate destination should be display ${results.toString()}`,
          });
          utils.errorLog(
            `${testCast}-04 :In ${title} Duplicate destination should be display ${results.toString()}`
          );
        } else {
          passLog.push({
            case_id: `${testCast}-04`,
            message: `In ${title} Duplicate destination should not display`,
          });
          utils.successLog(
            `${testCast}-04 :In ${title} Duplicate destination should not display`
          );
        }
        passLog.push({
          case_id: `${testCast}-3`,
          message: `In ${title} section 20 properties card should display in the 4*5 section`,
        });
        utils.successLog(
          `${testCast}-3 :In ${title} section 20 properties card should display in the 4*5 section`
        );
        const xpathExpression = `//p[contains(text(), '${childProperties[0]}, ${childProperties[1]}')]`;
        const paragraphElementHandle = await page.waitForXPath(xpathExpression);
        // Get the parent <p> element
        const locationBtn = await page.evaluate((element) => {
          const grandparentDiv = element.closest("div")?.parentNode;
          if (grandparentDiv) {
            const className = grandparentDiv.classList.value;
            const childData1 =
              grandparentDiv.querySelector(".child1-selector")?.textContent;
            const childData2 =
              grandparentDiv.querySelector(`.chakra-linkbox__overlay `)?.href;
            return { className, childData1, childData2 };
          }
          return null;
        }, paragraphElementHandle);
        if (locationBtn) {
          const previousURL = await page.url();
          await page.goto(locationBtn.childData2);
          await utils.sleep(10000);
          const currentURL = await page.url();
          if (previousURL != currentURL) {
            passLog.push({
              case_id: `${testCast}-04`,
              message: `When the user clicks on any destination, the listing page should open`,
            });
            utils.successLog(
              `${testCast}-04 :When the user clicks on any destination, the listing page should open`
            );
          } else {
            errorLog.push({
              case_id: `${testCast}-04`,
              message: `When the user clicks on any destination, the listing page should open`,
            });
            utils.errorLog(
              `${testCast}-04 :When the user clicks on any destination, the listing page should open`
            );
          }
        }

      } else {
        errorLog.push({
          case_id: `${testCast}-3`,
          message: `In ${title} section 20 properties card should display in the 4*5 section is not visible`,
        });
        utils.errorLog(
          `${testCast}-3 :In ${title} section 20 properties card should display in the 4*5 section is not visible`
        );
        return;
      }
    } else {
      errorLog.push({
        case_id: `${testCast}-2`,
        message: `In ${title} section 4 View more cities button is not visible`,
      });
      utils.errorLog(
        `${testCast}-2 :In ${title} section 4 View more cities button is not visible`
      );
      return;
    }
  } catch (error) {
    console.log(error)
  }
}

const verifyDestinations = async (page, errorLog, passLog, testCast, title) => {
  try {
    const findHeading = await utils.findText(
      page,
      `//h3[contains(text(), '${title}')]`
    );
    if (findHeading) {
      utils.logsaved(passLog, `${testCast}`, `${title} section visible`)
      utils.successLog(`${testCast} :${title} section visible`);
    } else {
      utils.logsaved(errorLog, `${testCast}`, `${title} section visible`)
      utils.errorLog(
        `${testCast} :${title} section not visible`
      );
    }
    const children = await utils.getParentToChildrens(page, `//h3[contains(text(), '${title}')]`, '.grid-cols-1 ');
    const linkData = children.childData2.split('\n');
    if (linkData.length === 16) {
      const duplicateLocation = utils.findDuplicates(linkData);
      if (duplicateLocation.length > 0) {
        utils.logsaved(errorLog, `${testCast}-03`, `Duplicate destination display ${duplicateLocation.toString()}`)
        utils.errorLog(errorLog, `${testCast}-03 : Duplicate destination display ${duplicateLocation.toString()}`)
      } else {
        utils.logsaved(passLog, `${testCast}-03`, `Duplicate destination should not display`)
        utils.successLog(`${testCast}-03 : Duplicate destination should not display`);
      }
      utils.logsaved(passLog, `${testCast}-01`, `16 Destination hyperlink should display`)
      utils.successLog(
        `${testCast}-01 :${title} 16 Destination hyperlink should display`
      );
    } else {
      utils.logsaved(errorLog, `${testCast}-01`, `16 Destination hyperlink not display`)
      utils.errorLog(`${testCast}-01 :${title} 16 Destination hyperlink not display`);
    }
    if (children?.children) {
      const previousURL = await page.url();
      await page.goto(children?.children);
      await utils.sleep(10000);
      const currentURL = await page.url();
      if (previousURL != currentURL) {
        utils.logsaved(passLog, `${testCast}-02`, `When the user clicks on any destination, the listing page should open`);
        utils.successLog(
          `${testCast}-02 :When the user clicks on any destination, the listing page should open`
        );
      } else {
        utils.logsaved(errorLog, `${testCast}-02`, `When the user clicks on any destination, the listing page should open`);
        utils.errorLog(
          `${testCast}-02 :When the user clicks on any destination, the listing page should open`
        );
      }
    }
  } catch (error) {
    console.log(`verifyDestinations`, error);
  }
}

const guestSaying = async (page, errorLog, passLog, testCast, title) => {
  try {
    const findHeading = await utils.findText(
      page,
      `//h3[contains(text(), '${title}')]`
    );
    if (findHeading) {
      utils.logsaved(passLog, `${testCast}`, `${title} section visible`)
      utils.successLog(`${testCast} :${title} section visible`);
    } else {
      utils.logsaved(errorLog, `${testCast}`, `${title} section visible`)
      utils.errorLog(
        `${testCast} :${title} section not visible`
      );
      return;
    }
    const textElementHandle = await page.waitForXPath(`//h3[contains(text(), '${title}')]`);
    // Get the grandparent div's class name
    const grandparentDivClassName = await page.evaluate((element) => {
      const grandparentDiv = element.closest("div")?.parentNode;
      // Return an object with class name and data from two child elements
      if (grandparentDiv) {
        const className = grandparentDiv.classList.value;
        const childData1 =
          grandparentDiv.querySelector(".child1-selector")?.textContent;
        const childData2 =
          grandparentDiv.querySelector('.slick-slider  ')?.innerText;
        const childres =
          grandparentDiv.querySelector('.slick-list  ')?.innerHTML;
        return { className, childData1, childData2, childres };
      }
      return null;
    }, textElementHandle);
    const sliderValue = grandparentDivClassName.childData2.split('\n').filter((n) => n);
    const totalStart = grandparentDivClassName.childres.split('</svg>').filter((n) => n);
    console.log(grandparentDivClassName)
    const nextbtn = sliderValue.some((nextBtn) => nextBtn == ' Next');
    const previous = sliderValue.some((nextBtn) => nextBtn == ' Previous');
    if (sliderValue.length >= 24) {
      utils.logsaved(passLog, `${testCast}-01`, `Total 11 review card should displayed`)
      utils.successLog(`${testCast}-01 :Total 11 review card should displayed`);
    } else {
      utils.logsaved(errorLog, `${testCast}-01`, `Total 11 review card not displayed`)
      utils.errorLog(`${testCast}-01 :${title}  Total 11 review card not displayed`);
    }
    if (nextbtn && previous) {
      utils.logsaved(passLog, `${testCast}-02`, ` Next and Previous button should display`)
      utils.successLog(`${testCast}-02 : Next and Previous button should display`);
    } else {
      utils.logsaved(errorLog, `${testCast}-02`, `Next and Previous button not display`)
      utils.errorLog(`${testCast}-02 :${title}  Next and Previous button not display`);
    }
    if (totalStart.length === 56) {
      utils.logsaved(passLog, `HM_TC_22-01`, `In user review card Star should be display`)
      utils.successLog(`HM_TC_22-01 : In user review card Star should be display`);
    } else {
      utils.logsaved(errorLog, `HM_TC_22-01`, `In user review card Star not display`)
      utils.errorLog(`HM_TC_22-01 :${title}  In user review card Star not display`);
    }
    const userreviewLocation = sliderValue.some((nextBtn) => nextBtn.includes('a deal') || nextBtn.includes('stay in'));
    if (userreviewLocation) {
      utils.logsaved(passLog, `HM_TC_22-02`, `User review text should be display`)
      utils.successLog(`HM_TC_22-02 : User review text should be display`);
    } else {
      utils.logsaved(errorLog, `HM_TC_22-02`, `User review text not display`)
      utils.errorLog(`HM_TC_22-02 :${title}  User review text not display`);
    }
  } catch (error) {
    console.log(`verifyDestinations`, error);
  }
}

const faq = async (page, errorLog, passLog, testCast, title) => {
  try {
    const findHeading = await utils.findText(
      page,
      `//h4[contains(text(), '${title}')]`
    );
    if (findHeading) {
      utils.logsaved(passLog, `${testCast}`, `${title} section visible`)
      utils.successLog(`${testCast} :${title} section visible`);
    } else {
      utils.logsaved(errorLog, `${testCast}`, `${title} section visible`)
      utils.errorLog(`${testCast} :${title} section not visible`);
      return;
    }
    const textElementHandle = await page.waitForXPath(`//h4[contains(text(), '${title}')]`);
    // Get the grandparent div's class name
    const grandparentDivClassName = await page.evaluate((element) => {
      const grandparentDiv = element.closest("div")?.parentNode;
      // Return an object with class name and data from two child elements
      if (grandparentDiv) {
        const className = grandparentDiv.classList.value;
        const link =
          grandparentDiv.querySelector("a ")?.href;
        const childData2 =
          grandparentDiv.querySelector('.flex')?.innerText;
        return { className, link, childData2 };
      }
      return null;
    }, textElementHandle);
    const faqQuestion = grandparentDivClassName.childData2.split('\n').filter((n) => n);
    if (faqQuestion.length === 3) {
      utils.logsaved(passLog, `${testCast}-01`, `A total 3 FAQs should display should displayed`)
      utils.successLog(`${testCast}-01 :A total 3 FAQs should display should displayed`);
    } else if (faqQuestion.length > 3) {
      utils.logsaved(errorLog, `${testCast}-01`, `A total more then 3 FAQs not displayed`)
      utils.errorLog(`${testCast}-01 :${title}  A total more then  3 FAQs not displayed`);
    } else {
      utils.logsaved(errorLog, `${testCast}-01`, `A total 3 FAQs not displayed`)
      utils.errorLog(`${testCast}-01 :${title}  A total 3 FAQs not displayed`);
    }
    const tagName = 'details'
    await page.waitForSelector(tagName);
    const btn = await page.$(tagName);
    if (btn) {
      await btn.click()
      const summary = await utils.getparentTOchildText(page, tagName, 'div');
      if (summary.length === 3) {
        utils.logsaved(passLog, `${testCast}-02`, `When the user clicks on the FAQs that section collapses and the FAQs detail display`)
        utils.successLog(`${testCast}-02 :When the user clicks on the FAQs that section collapses and the FAQs detail display`);
      } else {
        utils.logsaved(errorLog, `${testCast}-02`, `When the user clicks on the FAQs that section collapses and the FAQs detail not display`)
        utils.errorLog(`${testCast}-02 :${title}  When the user clicks on the FAQs that section collapses and the FAQs detail not display`);
      }
    }
    if (grandparentDivClassName?.link) {
      await page.goto(grandparentDivClassName?.link)
      utils.logsaved(passLog, `${testCast}-03`, `Visit our FAQ page for more info hyperlink should display `)
      utils.successLog(`${testCast}-03 :Visit our FAQ page for more info hyperlink should display`);
      utils.logsaved(passLog, `HM_TC_24`, `When the user clicks on the "Visit our FAQ page for more info" FAQ page should open`)
      utils.successLog(`HM_TC_24 :When the user clicks on the "Visit our FAQ page for more info" FAQ page should open`);
    } else {
      utils.logsaved(errorLog, `${testCast}-03`, `Visit our FAQ page for more info hyperlink not display `)
      utils.errorLog(`${testCast}-03 :${title}  Visit our FAQ page for more info hyperlink not display `);
      utils.logsaved(errorLog, `HM_TC_24`, `When the user clicks on the "Visit our FAQ page for more info" FAQ page should open`)
      utils.errorLog(`HM_TC_24 :When the user clicks on the "Visit our FAQ page for more info" FAQ page should open`);
    }

  } catch (error) {
    console.log(`verifyDestinations`, error);
  }
}

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
  await utils.sleep(2000);
  await luxuryVacationRentals(page, errorLog, passLog, 'HM_TC_13', 'vacation rentals for groups', `stays for groups`);
  await propertyVerification(page, errorLog, passLog);
  await page.goto("https://uat.whimstay.com/");
  await utils.sleep(2000);
  await luxuryVacationRentals(page, errorLog, passLog, 'HM_TC_14', 'vacation rentals with pools', `vacation rentals with pools`);
  await page.goto("https://uat.whimstay.com/");
  await utils.sleep(2000);
  await luxuryVacationRentals(page, errorLog, passLog, 'HM_TC_15', 'pet friendly vacation rentals', `pet friendly vacation rentals`);
  await page.goto("https://uat.whimstay.com/");
  await utils.sleep(2000);
  await luxuryVacationRentals(page, errorLog, passLog, 'HM_TC_16', 'vacation rentals with pools', `vacation rentals with pools`);
  await page.goto("https://uat.whimstay.com/");
  await utils.sleep(2000);
  await popularDesitination(page, errorLog, passLog, 'HM_TC_17', 'Popular Destinations');
  await page.goto("https://uat.whimstay.com/");
  await utils.sleep(1000);
  await verifyDestinations(page, errorLog, passLog, 'HM_TC_18', 'Trending beach destinations')
  await page.goto("https://uat.whimstay.com/");
  await utils.sleep(2000);
  await verifyDestinations(page, errorLog, passLog, 'HM_TC_19', 'Trending mountain destinations')
  await page.goto("https://uat.whimstay.com/");
  await utils.sleep(2000);
  await verifyDestinations(page, errorLog, passLog, 'HM_TC_20', 'Trending lake destinations')
  await page.goto("https://uat.whimstay.com/");
  await utils.sleep(2000);
  await guestSaying(page, errorLog, passLog, 'HM_TC_21', 'What guests are saying');
  await page.goto("https://uat.whimstay.com/");
  await utils.sleep(1000);
  await faq(page, errorLog, passLog, 'HM_TC_23', 'Common questions')

  await verifySearchBar(page, errorLog, passLog, 'HM_TC_15', ' pet friendly vacation rentals',);
  await checkElMonthCal(page, errorLog, passLog);
  await clearDate(page, errorLog, passLog);
  await checkElMonthCal(page, errorLog, passLog);
  await featureDeal(page, errorLog, passLog);
  // search functionality
  await AddGuest(page, errorLog, passLog);
  return {
    errorLog: errorLog,
    passLog: passLog,
  };
};
// homePage();
