// function for signup
const client = require("./db");
// const myutils = require('./')
exports.findText = async (page, text) => {
  try {
    // const xpath = `//button[contains(text(), '${buttonText}')]`;
    await page.waitForXPath(text);
    const [button] = await page.$x(text);
    return button;
  } catch (error) {
    console.log(error);
  }
};
exports.checkButtonvisibilty = async (page, buttonText) => {
  try {
    const xpath = `//button[contains(text(), '${buttonText}')]`;
    await page.waitForXPath(xpath);
    const [button] = await page.$x(xpath);
    return button;
  } catch (error) {
    console.log(error);
  }
};
exports.checkButtonAvaibilty = async (page, button) => {
  try {
    await page.waitForSelector(button);
    const isButtonDisabled = await page.$eval(
      button,
      (button) => button.disabled
    );
    return isButtonDisabled;
  } catch (error) {
    console.log(error);
  }
};

exports.sleep = async (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, milliseconds);
  });
};

exports.checkButtonExist = async (page, xpathSelector) => {
  try {
    // const xpath = `//button[contains(text(), '${buttonText}')]`;
    // const xpathSelector = `//form//button[contains(text(), "Log in")]`;
    await page.waitForXPath(xpathSelector);
    const [button] = await page.$x(xpathSelector);
    return button;
  } catch (error) {
    console.log(error);
  }
};

exports.gettingTexts= async(page, xpathSelector)=>{
  const formtext = await page.$$eval(xpathSelector, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        value: childElement.innerText,
      };
    });
  });
  return formtext;
}

exports.radomUserName = (length)=> {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

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
const closeModel = async(page, childNode, verifytext)=>{
  const formtext = await page.$$eval(childNode, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        value: childElement.innerText,
      };
    });
  });
  const isForm = formtext.some((obj) => obj.value == text);
  if(isForm){
    await page.waitForSelector(`//section//button[type="button"]`);
      // const isMobileButtonDisabled = await utils.checkButtonAvaibilty(
      //   page,
      //   `button[type="submit"]`
      // );
  }
  return 
}

exports.successLog = (message)=>{
  console.log('\x1b[32m%s\x1b[0m', `${message} => Pass`);  //cyan
}
exports.errorLog = (message)=>{
  console.log('\x1b[31m%s\x1b[0m', `${message} failed`);  //cyan
}