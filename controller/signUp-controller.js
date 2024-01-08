require("dotenv").config();
const puppeteer = require("puppeteer");
const utils = require("./utils");

// function for test case 1,2,3
const openSignUpModel = async (page, messagelist) => {
  const formtext = await page.$$eval(`form > *`, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        value: childElement.innerText,
      };
    });
  });
  const isForm = formtext.some((obj) => obj.value == `Want an extra $25 off?`);
  const signuptxt = "Sign up";
  const sxpath = `//button[contains(text(), '${signuptxt}')]`;
  await page.waitForXPath(sxpath);
  const [signButton] = await page.$x(sxpath);
  if (signButton) {
    if (!isForm) {
      await signButton.click();
    }
  }
};
const signUpButtonVisible = async (page, messagelist) => {
  const formtext = await page.$$eval(`form > *`, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        value: childElement.innerText,
      };
    });
  });
  const isForm = formtext.some((obj) => obj.value == `Want an extra $25 off?`);

  const signuptxt = "Sign up";
  const sxpath = `//button[contains(text(), '${signuptxt}')]`;
  await page.waitForXPath(sxpath);
  const [signButton] = await page.$x(sxpath);
  // test case 1 => Check for Log in button visible or not

  if (signButton) {
    console.log(`SU_TC_01 sign up button visible`);
    // let signButton;
    if (!isForm) {
      await signButton.click();
    }
    await utils.sleep(2000);
    const textVisible =
      "For a limited time, sign up and get a $25 promo code to use on any booking.";
    const innerText = await page.$$eval(`form > *`, (childElements) => {
      return childElements.map((childElement) => {
        return {
          name: childElement.tagName.toLowerCase(),
          value: childElement.innerText,
        };
      });
    });
    const isText = innerText.some((obj) => obj.value == textVisible);

    if (isText) {
      console.log(`singup model text visible`);
    } else {
      messagelist.push({
        case_id: "SU_TC_01",
        message: "On home page Login In button not able to display.",
      });
    }
    const emailTxtBox = await utils.checkButtonExist(
      page,
      `//form//button[contains(text(), "Sign up")]`
    );
    if (emailTxtBox) {
      console.log(`Sign up button available in signup form`);
    } else {
      console.log(`Sign up button not available in signup form`);
      messagelist.push({
        case_id: "SU_TC_01",
        message: "Sign up button in signup form",
      });
    }

    const hrefValue = await utils.checkButtonExist(
      page,
      `//form//button[contains(text(), "Log in")]`
    );
    if (hrefValue) {
      console.log(`Login button available`);
    } else {
      messagelist.push({
        case_id: "SU_TC_01",
        message: "Login button not available in signup form",
      });
    }
    const emailValidate = await utils.checkButtonAvaibilty(
      page,
      //   `//form//button[contains(text(), "Sign up")]`
      `button[type="submit"]`
    );
    if (emailValidate) {
      console.log("Sign up button is disable with empty data (email)..");
      const textBoxSelector = 'input[type="email"]';
      await page.waitForSelector(textBoxSelector);
      await page.$eval(textBoxSelector, (textBox) => (textBox.value = ""));
      var textToEnter = "and@mailinator.com";
      await page.type(textBoxSelector, textToEnter, { delay: 100 });
      await utils.sleep(1000);

      const xpathSelector = `//form//button[contains(text(), "Sign up")]`;
      await page.waitForXPath(xpathSelector);
      const [newsignButton] = await page.$x(xpathSelector);
      if (newsignButton) {
        await newsignButton.click();
        await utils.sleep(2000);
      }
    } else {
      messagelist.push({
        case_id: "SU_TC_03",
        message:
          "Sign Up Button remains disable untill register or unregister email address not fill up",
      });
    }
  } else {
    messagelist.push({
      case_id: "SU_TC_01",
      message: "On home page Login In button not able to display.",
    });
  }
};

// function for test case 4,5,6
const validaion = async (page, messagelist) => {
  const formtext = await page.$$eval(`form > *`, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        value: childElement.innerText,
      };
    });
  });
  const isForm = formtext.some((obj) => obj.value == `Forgot password?`);
  if (isForm) {
    console.log(`password screen`);
    const textBoxSelector = 'input[type="password"]';
    await page.waitForSelector(textBoxSelector);
    await page.$eval(textBoxSelector, (textBox) => (textBox.value = ""));
    var textToEnter = "Test@123";
    await page.type(textBoxSelector, textToEnter, { delay: 100 });
    const xpathSelector = `//form//button[contains(text(), "Log in")]`;
    await page.waitForXPath(xpathSelector);
    const [newsignButton] = await page.$x(xpathSelector);
    if (newsignButton) {
      await newsignButton.click();
      await utils.sleep(1000);
      const buttonSelector = `button[title="menu"]`;
      await page.waitForSelector(buttonSelector);
      await page.click(buttonSelector);
      await page.click(buttonSelector);
      await utils.sleep(2000);
      const isLogoutBtn = `nav`;
      await utils.sleep(1000);
      const cookies = await page.cookies();
      await Promise.all(cookies.map((cookie) => page.deleteCookie(cookie)));
      await page.reload({ waitUntil: "networkidle0" });
      await openSignUpModel(page, messagelist);
    }

    console.log(`otp screen`);
  } else {
    console.log(`signup form`);
  }
};

const signUpfunction = async (page, messagelist) => {};

const signUpflow22 = async (page, messagelist) => {
  try {
    try {
      const textBoxSelector = 'input[type="email"]';
      await page.waitForSelector(textBoxSelector);
      await page.$eval(textBoxSelector, (textBox) => (textBox.value = ""));
      var textToEnter = `${utils.radomUserName(8)}@mailnator.com`;
      await page.type(textBoxSelector, textToEnter, { delay: 100 });

      const submitBtn = await utils.checkButtonAvaibilty(
        page,
        `button[type="submit"]`
      );

      const SI_TC_14 = await utils.checkButtonvisibilty(page, `Sign up`);
      if (!SI_TC_14) {
        messagelist.push({
          case_id: "SI_TC_14",
          message: `When user click on Login button then "Continue with email" button should be display in login popup.`,
        });
      }
      if (submitBtn) {
        messagelist.push({
          case_id: "SI_TC_06",
          message: `The login button is disable with Invalid mobile number`,
        });
      } else {
        await page.click('button[type="submit"]');
        await utils.sleep(1000); // wait 1 sec
        const textSelector = "#firstName";
        // Wait for the element to be present
        await page.waitForSelector(textSelector);
        // Check if the expected text is present
        const isTextPresent = await page.$eval(textSelector, (element) => {
          const expectedText = `Ensure your name matches your government ID`;
          return element.placeholder;
        });

        if (isTextPresent) {
          await utils.sleep(2000);
          await page.waitForSelector(`#firstName`);
          await page.type(`#firstName`, "test", { delay: 100 });
          await page.type(`#lastName`, "test", { delay: 100 });
          await page.type(
            'input[type="tel"]',
            `70436298${Math.random() * 10}${Math.random() * 10}`
          );
          await page.type("#password", "Test@123", { delay: 100 });
          const dob = 'input[type="date"]';
          await page.waitForSelector(dob);
          await page.click(dob);
          var dobDate = `01-01-1992`;
          await page.type(`input[name="month"]`, "01");
          await page.type(`input[name="day"]`, "01");
          await page.type(`input[name="year"]`, "1992");
          // const selector = 'p.mb-6.mt-4.border-t.border-t-grayBorder.pt-4.text-xs.leading-5.text-[#999A9A].md:text-sm.md:leading-6';
          const expectedText =
            "By creating an account, I agree to the Whimstay Terms and Conditions and Privacy Statement and provide my consent to receive communications from Whimstay";
          await page.waitForSelector(`form`);

          const innerText = await page.$$eval(`form > *`, (childElements) => {
            return childElements.map((childElement) => {
              return {
                name: childElement.tagName.toLowerCase(),
                value: childElement.innerText,
              };
            });
          });
          const termConditionText = innerText.some(
            (obj) => obj.value == expectedText
          );
          if (!termConditionText) {
            messagelist.push({
              case_id: "SI_TC_13",
              message: `Text not found`,
            });
          }

          const xpathSelector = `//form//button[contains(text(), "Sign Up")]`;
          await page.waitForXPath(xpathSelector);
          const [newsignButton] = await page.$x(xpathSelector);
          if (newsignButton) {
            const xpathSelector = `//form//p[contains(text(), "Enter your birthday")]`;
            await page.waitForXPath(xpathSelector);
            const [textClick] = await page.$x(xpathSelector);
            if (newsignButton) {
              await textClick.click();
              await utils.sleep(2000);
              await newsignButton.click();
              await utils.sleep(5000);
            }
          }
        } else {
          messagelist.push({
            case_id: "SI_TC_11",
            message: `User will redirect to the sign up page and it will ask for require details.`,
          });
          console.log(`screen not found`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.signUp = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  let errorLog = [];
  const page = await browser.newPage();
  await page.goto("https://uat.whimstay.com/");
  await page.setViewport({ width: 1080, height: 864 });
  await signUpButtonVisible(page, errorLog); // test-case-1
  await validaion(page, errorLog); // test-case-4
  await signUpflow22(page, errorLog);
};

signUp();
