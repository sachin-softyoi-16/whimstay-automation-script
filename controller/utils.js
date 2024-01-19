// function for signup
const client = require("./db");
const fs = require('fs');
const path = require('path');
const os = require('node:os');
exports.removeTempFiles = async () => {
  console.log('Remove temp files function calling')
  try {
    const tempFolderPath = os.tmpdir();
    if (fs.existsSync(tempFolderPath)) {
      const tmpFiles = await fs.readdirSync(tempFolderPath);
      for (let i = 0; i < tmpFiles.length; i++) {
        const file = tmpFiles[i];
        if (file.startsWith('puppeteer')){
          const filePath = path.join(tempFolderPath, file);
          //remove file
          fs.unlink(filePath, err => {
            if (err) {
              console.error('Error removing file:', err);
              // Handle the error gracefully
            } else {
              console.log('File removed:', filePath);
            }
          });
        }
      }
    } else {
      console.log(`folder not exist `)
    }
  } catch (error) {
    console.log('Remove temp files ')
    console.log(error)
  }
}

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
exports.gettingValueFrom = async (page, value) => {
  await page.waitForSelector(value);

  // Get the value of the text box using its name attribute
  const textBoxValue = await page.$eval(value, (textBox) => {
    return textBox.value;
  });
  return textBoxValue;
}

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

exports.getparentTOchildText = async (page, parentTagName, childTagName) => {
  const innerText = await page.evaluate((parentTagName, childTagName) => {
    const parentElements = Array.from(document.getElementsByTagName(parentTagName));
    const innerTextArray = parentElements.map(parent => {
      const childElement = parent.querySelector(childTagName);
      return childElement ? childElement.textContent : null;
    });
    return innerTextArray;
  }, parentTagName, childTagName);
  return innerText
}
exports.gettingTexts = async (page, xpathSelector) => {
  const formtext = await page.$$eval(xpathSelector, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        value: childElement.innerText,
        child: childElement
      };
    });
  });
  return formtext;
}

exports.radomUserName = (length) => {
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
const closeModel = async (page, childNode, verifytext) => {
  const formtext = await page.$$eval(childNode, (childElements) => {
    return childElements.map((childElement) => {
      return {
        name: childElement.tagName.toLowerCase(),
        value: childElement.innerText,
      };
    });
  });
  const isForm = formtext.some((obj) => obj.value == text);
  if (isForm) {
    await page.waitForSelector(`//section//button[type="button"]`);
    // const isMobileButtonDisabled = await utils.checkButtonAvaibilty(
    //   page,
    //   `button[type="submit"]`
    // );
  }
  return
}

exports.successLog = (message) => {
  console.log('\x1b[32m%s\x1b[0m', `${message} => Pass`);  //cyan
}
exports.errorLog = (message) => {
  console.log('\x1b[31m%s\x1b[0m', `${message} failed`);  //cyan
}
exports.logsaved = (isArray, case_id, message) => {
  isArray.push({
    case_id: case_id,
    message: message,
  });
  return isArray;
}
exports.checkTagAvaibleOrNot = async (page, element) => {
  try {
    await page.waitForSelector(element, { visible: true });
    return true;
  } catch (error) {
    return false
  }
}
exports.findDuplicates = (arr) => {
  let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}

exports.getParentToChildContent = async (page, xpathExpression) => {
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
        grandparentDiv.querySelector(`.hideScrollBar `)?.innerText;

      return { className, childData1, childData2 };
    }

    return null;
  }, textElementHandle);
  return grandparentDivClassName;
}

exports.getParentToChildContent = async (page, xpathExpression) => {
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
        grandparentDiv.querySelector(`.hideScrollBar `)?.innerText;

      return { className, childData1, childData2 };
    }
    return null;
  }, textElementHandle);
  return grandparentDivClassName;
}

exports.getParentToChildrens = async (page, xpathExpression, nameofClass) => {
  const textElementHandle = await page.waitForXPath(xpathExpression);
  // Get the grandparent div's class name
  var abv = nameofClass;
  const grandparentDivClassName = await page.evaluate((element) => {
    const grandparentDiv = element.closest("div")?.parentNode;
    // Return an object with class name and data from two child elements
    if (grandparentDiv) {
      const className = grandparentDiv.classList.value;
      const childData1 =
        grandparentDiv.querySelector(".child1-selector")?.textContent;
      const childData2 =
        grandparentDiv.querySelector('.grid-cols-1 ')?.innerText;
      const children =
        grandparentDiv.querySelector('a')?.href;

      return { className, childData1, childData2, children };
    }
    return null;
  }, textElementHandle);
  return grandparentDivClassName;
}