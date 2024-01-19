require("dotenv").config();
const puppeteer = require("puppeteer");
const client = require("./db");
const moment = require("moment");
const { error } = require("selenium-webdriver");
const utils = require("./utils");
const signupflowController = require("./signUp-controller");
const { homePage } = require("./home-screen-controller");
const getPassword = async (mobile) => {
  try {
    let db = await client.connectToDatabase();
    // const otpCollection = await db.listCollections().toArray();
    const otpCollectionss = await db.collection("user_otp");
    const result = await otpCollectionss
      .find({ mobile_no: mobile })
      .sort({ created_dt: -1 })
      .toArray();
    return result;
  } catch (error) {
    console.log(error);
    console.log(`mongo connection error`, error);
  }
};

// function for test case 1 Check for Log in button visible or not
const logInButtonVisible = async (page, messagelist, passLog) => {
  const buttonText = "Log in";
  const xpath = `//button[contains(text(), '${buttonText}')]`;
  await page.waitForXPath(xpath);
  const [button] = await page.$x(xpath);
  // test case 1 => Check for Log in button visible or not
  if (button) {
    utils.successLog(`SI_TC_01 : login button visible => Pass`);
    const formtext = await page.$$eval(`form > *`, (childElements) => {
      return childElements.map((childElement) => {
        return {
          name: childElement.tagName.toLowerCase(),
          value: childElement.innerText,
        };
      });
    });
    const isForm = formtext.some(
      (obj) => obj.value == `Already have an account?Log in`
    );
    if (isForm) {
      utils.successLog(`SU_TC_01 : Sign Up Button Visible & Clickable => Pass`);
      await button.click();
    } else {
    }
    await button.click();
    utils.successLog(
      `HP_TC_01 : Login: Welcome to Whimstay login pop-up should open. => Pass`
    );
    utils.successLog(
      `SI_TC_01 : Login: On home page Login In button should be display. => Pass`
    );

    passLog.push(
      {
        case_id: "SI_TC_01",
        message: "On home page Login In button should be display.",
      },
      {
        case_id: "HP_TC_01",
        message: "Login: Welcome to Whimstay login pop-up should open.",
      }
    );
  } else {
    utils.errorLog(
      "SI_TC_01 =>On home page Login In button not able to display. => failed"
    );
    messagelist.push({
      case_id: "SI_TC_01",
      message: "On home page Login In button not able to display.",
    });
  }
  const signuptxt = "Sign up";
  const sxpath = `//button[contains(text(), '${signuptxt}')]`;
  await page.waitForXPath(sxpath);
  const [signButton] = await page.$x(xpath);
  // test case 1 => Check for Log in button visible or not
  if (signButton) {
    utils.successLog(`SU_TC_01 sign up button visible`);
    passLog.push({
      case_id: "SU_TC_01",
      message: "Sign Up Button Visible & Clickable",
    });
    // await signButton.click();
  } else {
    utils.errorLog(
      `SU_TC_01: On home page Login In button not able to display.`
    );
    messagelist.push({
      case_id: "SU_TC_01",
      message: "On home page Login In button not able to display.",
    });
  }
};
// function for test case 2, 15 Check for Log in button visible or not
const checkLoginValidation = async (page, messagelist, passLog) => {
  try {
    await page.waitForSelector(`button[type="submit"]`);
    const emailValidate = await checkButtonAvaibilty(
      page,
      `button[type="submit"]`
    );
    if (emailValidate) {
      utils.successLog(
        "SI_TC_02 :Check Login disable with empty data (email).. => Pass"
      );
      passLog.push({
        case_id: "SI_TC_02",
        message: "Check Login validaion with empty data (email).",
      });
    } else {
      messagelist.push({
        case_id: "SI_TC_02",
        message: "Check Login validaion with empty data (email).",
      });
      console.log("Check Login validaion with empty data (email)..");
    }
    const isMobile = await checkButtonvisibilty(page, "Log in with a phone");
    if (isMobile) {
      await isMobile.click();
      await page.waitForSelector(`button[type="submit"]`);
      const isMobileButtonDisabled = await checkButtonAvaibilty(
        page,
        `button[type="submit"]`
      );
      if (isMobileButtonDisabled) {
        utils.successLog(
          "SI_TC_02: Check Login disable with empty data (Moblie Number).."
        );
        passLog.push({
          case_id: "SI_TC_02",
          message: "Check Login disable with empty data (Moblie Number).",
        });
      } else {
        utils.errorLog(
          `SI_TC_02: Check Login validaion with empty data (Moblie Number).`
        );
        messagelist.push({
          case_id: "SI_TC_02",
          message: "Check Login validaion with empty data (Moblie Number).",
        });
        console.log("Check Login enable with empty data (Moblie Number)..");
      }
    } else {
      utils.errorLog(`SI_TC_02: button is enable with vailid mobile`);
      messagelist.push({
        case_id: "SI_TC_02",
        message: "Have no button for Log in with a phone.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// function for test case 3 Do not allow to enter more than 10 digit.
const mobileNumberLength = async (page, messagelist, passLog) => {
  const textBoxSelector = 'input[type="tel"]';
  await page.waitForSelector(textBoxSelector);
  await page.$eval(textBoxSelector, (textBox) => (textBox.value = ""));
  var textToEnter = "704362986265465";
  await page.type(textBoxSelector, textToEnter, { delay: 100 });
  const btnValidate = await checkButtonAvaibilty(page, `button[type="submit"]`);
  if (btnValidate) {
    utils.successLog(`Tast-Case-3: Do not allow to enter more than 10 digit.`);
    passLog.push({
      case_id: "SI_TC_03",
      message: "Do not allow to enter more than 10 digit.",
    });
  } else {
    messagelist.push({
      case_id: "SI_TC_03",
      message: "Do not allow to enter more than 10 digit.",
    });
    utils.errorLog(`Tast-Case-3 allow to enter more than 10 digit.`);
  }
};

// function for test case 4 and 5
const mobileNumberValidT4 = async (page, messagelist, passLog) => {
  const textBoxSelector = 'input[type="tel"]';
  await page.waitForSelector(textBoxSelector);
  await page.$eval(textBoxSelector, (textBox) => (textBox.value = ""));
  var textToEnter = "78467";
  await page.type(textBoxSelector, textToEnter, { delay: 100 });
  const btnValidate = await checkButtonAvaibilty(page, `button[type="submit"]`);
  if (btnValidate) {
    passLog.push({
      case_id: "SI_TC_04",
      message: `Validation message should be display like "Phone number not valid. Please try again" and continue button will remin disable untill user not enter 10 digits.`,
    });
    utils.successLog(
      `SI_TC_04 - button is disabled due to invailid mobile number`
    );
  } else {
    messagelist.push({
      case_id: "SI_TC_04",
      message: `Validation message should be display like "Phone number not valid. Please try again" and continue button will remin disable untill user not enter 10 digits.`,
    });
    utils.errorLog(`SI_TC_04 - button is enable with Invailid mobile number`);
  }

  /// test case 5 for It should allow to add  only numeric value.
  await page.$eval(textBoxSelector, (textBox) => (textBox.value = ""));
  var nonNumericValue = "asdasdsa@!#%^&(*asd";
  await page.type(textBoxSelector, nonNumericValue, { delay: 100 });
  const textBoxValue = await page.$eval(
    textBoxSelector,
    (textBox) => textBox.value
  );
  const isNumeric = /^\d+$/.test(textBoxValue);
  if (isNumeric) {
    utils.errorLog(
      `SI_TC_05 - It's not allow to add  only numeric value and it's allow Alphabet, Special Character or space.`
    );
    messagelist.push({
      case_id: "SI_TC_05",
      message: `It should allow to add  only numeric value and it's allow Alphabet, Special Character or space.`,
    });
  } else {
    passLog.push({
      case_id: "SI_TC_05",
      message: `It should allow to add  only numeric value and it's allow Alphabet, Special Character or space.`,
    });
    utils.successLog(
      "SI_TC_05 - The text box does not allow only numeric values."
    );
  }
};

// function for test case 6 and 7
const loginValidation = async (page, messagelist) => {
  try {
    const textBoxSelector = 'input[type="tel"]';
    await page.waitForSelector(textBoxSelector);
    await page.$eval(textBoxSelector, (textBox) => (textBox.value = "+1"));
    var textToEnter = "7043629862";
    await page.type(textBoxSelector, textToEnter, { delay: 100 });
    const submitBtn = await checkButtonAvaibilty(page, `button[type="submit"]`);
    if (submitBtn) {
      messagelist.push({
        case_id: "SI_TC_06",
        message: `The login button is disable with valid mobile number`,
      });
    } else {
      const logBtn = await page.click('button[type="submit"]');
      const otpScreen = await checkButtonvisibilty(page, `Try again`);
      if (otpScreen) {
        const isOtpResp = await getPassword(`+1${textToEnter}`);
        const otptextBoxSelector = 'input[type="tel"]';
        var otpcode = `${isOtpResp[0].otp_code}`;
        await page.type(otptextBoxSelector, otpcode, { delay: 100 });

        const userLogin = await checkButtonvisibilty(page, `Log in`);
        if (userLogin) {
          messagelist.push({
            case_id: "SI_TC_06",
            message: `Too many unsuccessful login attempts. Please try again in 1 hour.error from api side`,
          });
        } else {
        }
      } else {
        console.log(
          `Too many unsuccessful login attempts. Please try again in 1 hour.error from api side`
        );
        messagelist.push({
          case_id: "SI_TC_06",
          message: `Too many unsuccessful login attempts. Please try again in 1 hour.error from api side`,
        });
      }
      console.log(otpScreen);
    }
  } catch (error) {
    console.log(error);
  }
};
//function for test case 6,7, 8,10 resent otp
const resetOtp = async (page, messagelist, passLog) => {
  // try {
  const textBoxSelector = 'input[type="tel"]';
  await page.waitForSelector(textBoxSelector);
  await page.$eval(textBoxSelector, (textBox) => (textBox.value = "+1"));
  var textToEnter = " 7043629862";
  await page.type(textBoxSelector, textToEnter, { delay: 100 });
  const submitBtn = await checkButtonAvaibilty(page, `button[type="submit"]`);
  if (submitBtn) {
    utils.errorLog(
      `SI_TC_06 : The login button is disable with valid mobile number`
    );
    messagelist.push({
      case_id: "SI_TC_06",
      message: `The login button is disable with valid mobile number`,
    });
  } else {
    utils.successLog(
      `SI_TC_06 : The login button is disable with valid mobile number`
    );
    passLog.push({
      case_id: "SI_TC_06",
      message: `The login button is disable with valid mobile number`,
    });
    const xpathSelector = `//form//button[contains(text(), "Log in")]`;
    await page.waitForXPath(xpathSelector);
    const [submitButton] = await page.$x(xpathSelector);

    if (submitButton) {
      await submitButton.click();
      await sleep(2000);

      const tooMany =
        "Too many unsuccessful login attempts. Please try again in 1 hour.";
      const innerText = await page.$$eval(`form > *`, (childElements) => {
        return childElements.map((childElement) => {
          return {
            name: childElement.tagName.toLowerCase(),
            value: childElement.innerText,
          };
        });
      });
      const isText = innerText.some((obj) => obj.value == tooMany);

      if (!isText) {
        await sleep(1000);
        const otpScreen = await checkButtonvisibilty(page, `Try again`);
        if (otpScreen) {
          utils.successLog(
            `SI_TC_06 : Once user enter valid mobile number it will redirect to the OTP screen where user have to enter 6 digit OTP.`
          );
          utils.errorLog(
            `SI_TC_08 : Resent button click and enter new one password but api is not verified latest otp. It's bug from api side.`
          );
          utils.errorLog(`SI_TC_09 : New otp not verified from backend.`);
          utils.errorLog(
            `SI_TC_10 : Do not allow user to login with OLD otp. it should display expire otp in red color. not getting color attribute`
          );
          passLog.push({
            case_id: "SI_TC_06",
            message: `Once user enter valid mobile number it will redirect to the OTP screen where user have to enter 6 digit OTP.`,
          });
          messagelist.push({
            case_id: "SI_TC_10",
            message: `Do not allow user to login with OLD otp. it should display expire otp in red color. not getting color attribute`,
          });

          messagelist.push({
            case_id: "SI_TC_08",
            message: `Resent button click and enter new one password but api is not verified latest otp. It's bug from api side.`,
          });
          messagelist.push({
            case_id: "SI_TC_09",
            message: `New otp not verified from backend.`,
          });

          const otptextBoxSelector = 'input[type="tel"]';
          // var otpcode = ` 522316555`;
          // Loop through each character in the input data and type it with a delay
          // await page.type(otptextBoxSelector, otpcode, { delay: 100 });
          // await page.waitForSelector(otptextBoxSelector);
          // await sleep(2000);
          // await otpScreen.click();
          const textSelector = "p";
          const expectedText = `The text "Didn't get a code? Wait for`;
          // Wait for the element to be present
          await page.waitForSelector(textSelector);
          // Check if the expected text is present
          // const isTextPresent = await page.$eval("body", (body) => {
          //   return body.textContent.includes(`Didn't get a code? Wait for `);
          // });
          // if (isTextPresent) {
          await sleep(1000);
          console.log(`The text "${expectedText}" is present on the page.`);
          const isOtpResp = await getPassword(`+1${textToEnter.trim()}`);
          // const otptextBoxSelector = 'input[type="tel"]';
          var otpcode = `  ${isOtpResp[0].otp_code}`;
          await sleep(1000);
          await page.type(otptextBoxSelector, otpcode, { delay: 100 });
        } else {
          console.log(`The text "${expectedText}" is not present on the page.`);
          utils.errorLog(
            `SI_TC_06: Once user enter valid mobile number it will redirect to the OTP screen where user have to enter 6 digit OTP.`
          );
          messagelist.push({
            case_id: "SI_TC_06",
            message: `Once user enter valid mobile number it will redirect to the OTP screen where user have to enter 6 digit OTP.`,
          });
          // messagelist.push({
          //   case_id: "SI_TC_08",
          //   message: `Timer not display with this message "Didn't get a code? Wait for 60 seconds before trying again"`,
          // });
        }
        // } else if (ariaInvalidValue === "false") {
        //   messagelist.push({
        //     case_id: "SI_TC_10",
        //     message: `Do not allow user to login with OLD otp. it should display expire otp in red color.`,
        //   });
        //   console.log(
        //     `Enter wrong otp but not red color. it should display expire otp in red color.`
        //   );
        // } else {
        //   console.log(
        //     "The aria-invalid attribute for the text box is not set or has a different value."
        //   );
        // }
        // }

        // const userLogin = await checkButtonvisibilty(page, `Log in`);

        // const otpScreen = await checkButtonvisibilty(page, `Try again`);
        // if (otpScreen) {
        //   await otpScreen.click();
        //   const textSelector = "p";
        //   const expectedText = `Didn't get a code? Wait for 15 seconds before trying again.`;
        //   // Wait for the element to be present
        //   await page.waitForSelector(textSelector);
        //   // Check if the expected text is present
        //   const isTextPresent = await page.$eval(
        //     textSelector,
        //     (element, expectedText) => {
        //       return element.textContent.includes(expectedText);
        //     },
        //     expectedText
        //   );

        //   if (isTextPresent) {
        //     console.log(`The text "${expectedText}" is present on the page.`);
        //   } else {
        //     console.log(`The text "${expectedText}" is not present on the page.`);
        //   }

        //   const isOtpResp = await getPassword(`+1${textToEnter}`);
        //   const otptextBoxSelector = 'input[type="tel"]';
        //   var otpcode = ` ${isOtpResp[0].otp_code}`;
        //   await page.type(otptextBoxSelector, otpcode, { delay: 100 });
        //   const userLogin = await checkButtonvisibilty(page, `Log in`);
        //   if (userLogin) {
        //     messagelist.push({
        //       case_id: "SI_TC_06",
        //       message: `Too many unsuccessful login attempts. Please try again in 1 hour.error from api side`,
        //     });
        //   } else {
        //   }
        // } else {
        //   console.log(
        //     `Too many unsuccessful login attempts. Please try again in 1 hour.error from api side`
        //   );
        //   messagelist.push({
        //     case_id: "SI_TC_06",
        //     message: `Too many unsuccessful login attempts. Please try again in 1 hour.error from api side`,
        //   });
        // }
        // console.log(otpScreen);
      } else {
        utils.errorLog(
          `SI_TC_06 "Too many unsuccessful login attempts. Please try again in 1 hour.error from api side`
        );
        messagelist.push({
          case_id: "SI_TC_06",
          message: `Too many unsuccessful login attempts. Please try again in 1 hour.error from api side`,
        });
        throw `Too many unsuccessful login attempts. Please try again in 1 hour.error from api side`;
      }
    }
  }
  // } catch (error) {
  //   console.log(error);
  // }
};

// function for signup

const findText = async (page, text) => {
  try {
    // const xpath = `//button[contains(text(), '${buttonText}')]`;
    await page.waitForXPath(text);
    const [button] = await page.$x(text);
    return button;
  } catch (error) {
    console.log(error);
  }
};
const checkButtonvisibilty = async (page, buttonText) => {
  try {
    const xpath = `//button[contains(text(), '${buttonText}')]`;
    await page.waitForXPath(xpath);
    const [button] = await page.$x(xpath);
    return button;
  } catch (error) {
    console.log(error);
  }
};
const checkButtonAvaibilty = async (page, button) => {
  try {
    const isButtonDisabled = await page.$eval(
      button,
      (button) => button.disabled
    );
    return isButtonDisabled;
  } catch (error) {
    console.log(error);
  }
};

// function for test case 2 Check Login validaion with empty data (Moblie Number)
const checkWithEmail = async (page, messagelist) => {
  const textBoxSelector = 'input[type="email"]';
  await page.waitForSelector(textBoxSelector);
  var textToEnter = "andmailinatorsss.com";
  await page.type(textBoxSelector, textToEnter, { delay: 100 });
  emailValidate = await checkButtonAvaibilty(page, `button[type="submit"]`);
  if (emailValidate) {
    console.log(`button is disabled due to invailid email`);
    await page.$eval(textBoxSelector, (textBox) => (textBox.value = ""));
    var textToEnter = "and@mailinator.com";
    await page.type(textBoxSelector, textToEnter, { delay: 100 });
    emailValidate = await checkButtonAvaibilty(page, `button[type="submit"]`);
    if (emailValidate) {
      console.log(`button is disabled due to invailid email`);
    } else {
      console.log(`button is enable with vailid email`);
    }
  }
};

// function for test case 2 Check Login validaion with empty data (Moblie Number)
const checkWithmobile = async (page, messagelist) => {
  const textBoxSelector = 'input[type="tel"]';
  await page.waitForSelector(textBoxSelector);
  var textToEnter = "4586451";
  await page.type(textBoxSelector, textToEnter, { delay: 100 });
  emailValidate = await checkButtonAvaibilty(page, `button[type="submit"]`);
  if (emailValidate) {
    console.log(`button is disabled due to invailid mobile number`);
    await page.$eval(textBoxSelector, (textBox) => (textBox.value = ""));
    var textToEnter = "7043629862";
    await page.type(textBoxSelector, textToEnter, { delay: 100 });
    emailValidate = await checkButtonAvaibilty(page, `button[type="submit"]`);
    if (emailValidate) {
      utils.successLog(`button is disabled due to invailid mobile number`);
    } else {
      utils.errorLog(`button is enable with vailid mobile number`);
    }
  }
};
// function test case 11, 13, 14,16, 17,18, 19
const sleep = async (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, milliseconds);
  });
};
const signUpflow = async (page, messagelist) => {
  try {
    try {
      const textBoxSelector = 'input[type="tel"]';
      await page.waitForSelector(textBoxSelector);
      await page.$eval(textBoxSelector, (textBox) => (textBox.value = "+1"));
      var textToEnter = "7043629865";
      await page.type(textBoxSelector, textToEnter, { delay: 100 });

      const submitBtn = await checkButtonAvaibilty(
        page,
        `button[type="submit"]`
      );

      const SI_TC_14 = await checkButtonvisibilty(page, `Log in with email`);
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
        await sleep(1000); // wait 1 sec
        const textSelector = "#firstName";
        // Wait for the element to be present
        await page.waitForSelector(textSelector);
        // Check if the expected text is present
        const isTextPresent = await page.$eval(textSelector, (element) => {
          const expectedText = `Ensure your name matches your government ID`;
          return element.placeholder;
        });

        if (isTextPresent) {
          await sleep(2000);
          // await page.waitForSelector(`#firstName`);
          // await page.type(`#firstName`, "test");
          // await page.type(`#lastName`, "test");
          // await page.type(`#email`, "test@mailinatior.com");

          // const dob = 'input[type="date"]';
          // await page.waitForSelector(dob);
          // await page.click(dob);
          // var dobDate = `01-01-1992`;
          // await page.type(`input[name="month"]`, "01");
          // await page.type(`input[name="day"]`, "01");
          // await page.type(`input[name="year"]`, "1992");
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
          const xpath = '//p[contains(., "Log in")]/button';
          await page.waitForXPath(xpath);
          const [button] = await page.$x(xpath);
          if (button) {
            await button.click();
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

const signUpflow22 = async (page, messagelist, passLog) => {
  try {
    try {
      const textBoxSelector = 'input[type="tel"]';
      await page.waitForSelector(textBoxSelector);
      await page.$eval(textBoxSelector, (textBox) => (textBox.value = "+1"));
      var textToEnter = `7043629${Math.floor(Math.random() * 10)}${Math.floor(
        Math.random() * 10
      )}${Math.floor(Math.random() * 10)}`;

      await page.type(textBoxSelector, textToEnter, { delay: 100 });

      const submitBtn = await checkButtonAvaibilty(
        page,
        `button[type="submit"]`
      );

      const SI_TC_14 = await checkButtonvisibilty(page, `Log in with email`);
      if (!SI_TC_14) {
        utils.errorLog(
          `SI_TC_14: When user click on Login button then "Continue with email" button should be display in login popup.`
        );
        messagelist.push({
          case_id: "SI_TC_14",
          message: `When user click on Login button then "Continue with email" button should be display in login popup.`,
        });
      } else {
        utils.successLog(
          `SI_TC_14: When user click on Login button then "Continue with email" button should be display in login popup.`
        );
        passLog.push({
          case_id: "SI_TC_14",
          message: `When user click on Login button then "Continue with email" button should be display in login popup.`,
        });
      }
      if (submitBtn) {
        utils.errorLog(
          `SI_TC_06: The login button is disable with Invalid mobile number`
        );
        messagelist.push({
          case_id: "SI_TC_06",
          message: `The login button is disable with Invalid mobile number`,
        });
      } else {
        utils.successLog(
          `SI_TC_06: The login button is disable with Invalid mobile number`
        );
        passLog.push({
          case_id: "SI_TC_06",
          message: `The login button is disable with Invalid mobile number`,
        });

        await page.click('button[type="submit"]');
        await sleep(1000); // wait 1 sec
        const textSelector = "#firstName";
        // Wait for the element to be present
        await page.waitForSelector(textSelector);
        // Check if the expected text is present
        const isTextPresent = await page.$eval(textSelector, (element) => {
          const expectedText = `Ensure your name matches your government ID`;
          return element.placeholder;
        });

        if (isTextPresent) {
          utils.successLog(
            `SI_TC_11 : User will redirect to the sign up page and it will ask for require details.`
          );
          passLog.push({
            case_id: "SI_TC_11",
            message: `User will redirect to the sign up page and it will ask for require details.`,
          });
          await sleep(2000);
          await page.waitForSelector(`#firstName`);
          await page.type(`#firstName`, "test", { delay: 100 });
          await page.type(`#lastName`, "test", { delay: 100 });
          await page.type(`#email`, `${utils.radomUserName(8)}@mailnator.com`, {
            delay: 100,
          });

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
            utils.errorLog(`SI_TC_13 : Text not found`);
            messagelist.push({
              case_id: "SI_TC_13",
              message: `Text not found`,
            });
          } else {
            utils.successLog(`SI_TC_13 : Text not found`);
            passLog.push({
              case_id: "SI_TC_13",
              message: `Text not found`,
            });
          }

          // await page.type(textBoxSelector, textToEnter);
          const xpathSelector = `//form//button[contains(text(), "Sign Up")]`;
          await page.waitForXPath(xpathSelector);
          // await page.click('button[type="submit"]');
          // const submitButtonSelector = 'button[type="submit"]';
          // await page.waitForSelector(submitButtonSelector);
          // await page.click(submitButtonSelector);

          // await page.waitForXPath(xpathSelector);
          // const [newsignButton] = await page.$x(xpathSelector);
          const [newsignButton] = await page.$x(xpathSelector);
          if (newsignButton) {
            const xpathSelector = `//form//p[contains(text(), "Enter your birthday")]`;
            await page.waitForXPath(xpathSelector);
            const [textClick] = await page.$x(xpathSelector);
            if (textClick) {
              await textClick.click();
              await sleep(2000);
              await newsignButton.click();
              await sleep(2000);

              const otpScreen = await checkButtonvisibilty(page, `Try again`);
              if (otpScreen) {
                const otptextBoxSelector = 'input[type="tel"]';

                const textSelector = "p";
                const expectedText = `The text "Didn't get a code? Wait for`;
                // Wait for the element to be present
                await page.waitForSelector(textSelector);
                await sleep(1000);
                console.log(
                  `The text "${expectedText}" is present on the page.`
                );
                const isOtpResp = await getPassword(`+1${textToEnter}`);
                // const otptextBoxSelector = 'input[type="tel"]';
                var otpcode = `  ${isOtpResp[0].otp_code}`;
                await sleep(1000);
                await page.type(otptextBoxSelector, otpcode, { delay: 100 });
              }
            }
          }
        } else {
          messagelist.push({
            case_id: "SI_TC_11",
            message: `User will redirect to the sign up page and it will ask for require details.`,
          });
          utils.errorLog(
            `SI_TC_11: User will redirect to the sign up page and it will ask for require details.`
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
const logOutFeature = async (page, messagelist, passLog) => {
  try {
    await sleep(3000);
    const isLogin = `button[title="menu"]`;
    await page.waitForSelector(isLogin);
    passLog.push({
      case_id: "SI_TC_07",
      message: `Once user enter 6 digit OTP then it will automatically redirect to the home screen.`,
    });
    utils.successLog(
      `SI_TC_07: Once user enter 6 digit OTP then it will automatically redirect to the home screen.`
    );
    await page.click(isLogin);
    await page.click(isLogin);
    await sleep(1000);
    const cookies = await page.cookies();
    await Promise.all(cookies.map((cookie) => page.deleteCookie(cookie)));
    await page.reload({ waitUntil: "networkidle0" });
  } catch (error) {
    console.log(error);
    messagelist.push({
      case_id: "SI_TC_07",
      message: `Once user enter 6 digit OTP then it will automatically redirect to the home screen.`,
    });
    utils.errorLog(
      `SI_TC_07: Once user enter 6 digit OTP then it will automatically redirect to the home screen.`
    );
    // throw `User not login`;
  }
};
const runScript = async () => {
  let errorLog = [];
  let passLog = [];
  let page;
  // let browser;
  try {
    // await utils.removeTempFiles();
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    });
    page = await browser.newPage();
    await page.goto("https://uat.whimstay.com/");
    await page.waitForTimeout(1000); // Wait for some time to ensure the page is loaded
    await page.setViewport({ width: 1536, height: 864 });
    await sleep(2000);
    // await homePage(page, errorLog, passLog)

    await logInButtonVisible(page, errorLog, passLog); // test-case-1
    await checkLoginValidation(page, errorLog, passLog); // test-case-2
    await sleep(15000);
    await mobileNumberLength(page, errorLog, passLog);
    await mobileNumberValidT4(page, errorLog, passLog);
    await resetOtp(page, errorLog, passLog);
    await sleep(1000);
    await logOutFeature(page, errorLog, passLog);
    await sleep(1000);
    await logInButtonVisible(page, errorLog, passLog); //check text
    await checkLoginValidation(page, errorLog, passLog); // test-case-2
    await signUpflow22(page, errorLog, passLog);
    await sleep(1000);
    await logOutFeature(page, errorLog, passLog);
    await sleep(1000);
    console.log(
      `before signup`,
      `Test-case passed : ${passLog.length}`,
      `test case failed : ${errorLog.length}`
    );
    const resp = await signupflowController.signUp(page, errorLog, passLog);
    await homePage(page, errorLog, passLog);
    console.log("\x1b[32m%s\x1b[0m", `Test-case passed : ${passLog.length}`),
      console.log("\x1b[31m%s\x1b[0m", `test case failed : ${errorLog.length}`);

    // await logInButtonVisible(page, errorLog); // test-case-1
    // await sleep(1000);
    // await checkLoginValidation(page, errorLog); // test-case-2
  } catch (error) {
    // await homePage(page, errorLog, passLog)

    console.log("\x1b[32m%s\x1b[0m", `Test-case passed : ${passLog.length}`),
      console.log("\x1b[31m%s\x1b[0m", `test case failed : ${errorLog.length}`);
    console.log(error);
  }
};
runScript();
// getPassword(`+17043629862`)
