const Spinner = require('cli-spinner');
const puppeteer = require('puppeteer');
const colors = require('colors');
const taskHandler = require('./taskHandler');
const myInfo = require('./myInfo');
const utils = require('./utils');

async function ubiquitiBot() {
  // Spinner 
  var mySpinner = new Spinner.Spinner('processing.. %s');
  mySpinner.setSpinnerString('|/-\\');
  mySpinner.start();

  try {
    let launcherArgs;
    let pathToBrowser = process.env.PUPPETEER_EXEC_PATH;

    if (process.env.USER_ENV === 'testUserInfo') {
      launcherArgs = ['--no-sandbox', '--deterministic-fetch', '--disable-setuid-sandbox', `--window-size=1025,1025`];
      pathToBrowser = process.env.PUPPETEER_EXEC_PATH;
    } else {
      launcherArgs = ['--no-sandbox', `--window-size=1025,1025`];
    }

    // Start of test: Launch and go to login website
    const browser = await puppeteer.launch({
      defaultViewport: null,
      headless: false, // not sure about running headless.. Bot detection.
      args: launcherArgs,
      executablePath: pathToBrowser,
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
    await page.goto('https://store.ui.com', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: `${myInfo.snapShotPath}+start.png` });

    // Login
    await taskHandler.logIn(page);

    let amountOrdered = 0;
    while (amountOrdered < 1) {

      console.log('\n[1/4] .. Navigating to listing page ..'.bgBlue);
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');

      await page.waitForTimeout(2000);
      await page.goto(`${myInfo.listingURL}`, { waitUntil: 'networkidle2' });

      await page.screenshot({ path: `${myInfo.snapShotPath}+listing_page.png` });
      
      // Checking to see if listing is out of stock
      let inventoryText;
      let isOutOfStock = false;

      try {
        inventoryText = await page.$eval(utils.selectors.get('outOfStock_selector'), (element) => { return element.innerHTML });
        isOutOfStock = inventoryText.includes('This device is currently sold out');
        console.log('isOutOfStock: ' + `${isOutOfStock}`.red);
      } catch (error) {
        console.log('item in stock, proceed');
      }
      
      // While listing is out of stock: Refresh page, check availability 
      let testRuns = 0;
      while (isOutOfStock) { // reversing the logic for now, will create new variable for stock selector 
        console.log('\nOUT OF STOCK'.red);
        console.log('\nRefreshing Page..'.yellow);
        await page.reload();

        // Check if current store has listing 
        await page.waitForTimeout(10000);
        await page.waitForSelector(utils.selectors.get('outOfStock_selector'));
        inventoryText = await page.$eval(utils.selectors.get('outOfStock_selector'), (element) => { return element.innerHTML });
        isOutOfStock = inventoryText.includes('This device is currently sold out');

        if ((`${process.env.USER_ENV}` == 'testUserInfo' && testRuns == 10)) {
          testRuns++;
          return;
        }

      }

      console.log('\nListing is in stock !!'.bgBlue);

      // Add listing to cart
      console.log('\n[2/4] .. Adding item to cart ..'.bgBlue);
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      
      // For right now, just select the default item.
      // await page.waitForSelector(utils.selectors.get('pickUp_bttn_selector'));
      // await page.$eval(utils.selectors.get('pickUp_bttn_selector'), (el) => el.click());
      
      await page.waitForSelector(utils.selectors.get('chekout_bttn_selector_1'));
      await page.focus(utils.selectors.get('chekout_bttn_selector_1'));
      await page.keyboard.press('Enter');

      //await pickUp_bttn[0].click();
      //await page.waitForTimeout(500);
      // await page.waitForTimeout({ waitUntil: 'networkidle2' });
      // console.log('Item added to cart ..');
      // await page.screenshot({ path: `${myInfo.snapShotPath}+added_to_cart.png` });

      // // Navigate to cart
      // console.log('\n[3/4] .. Navigating to cart ..'.bgBlue);
      // const cartURL = 'https://secure.newegg.com/shop/cart';
      // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      // await page.goto(`${cartURL}`);
      // await page.waitForTimeout(500);
      // await page.screenshot({ path: `${myInfo.snapShotPath}+nav_to_cart.png` });

      // //Checkout listing
      // console.log('\n[4/4] .. Checking out cart ..'.bgBlue);
      // await taskHandler.checkoutCart(page);

      // // Ctrl+C && Celebrate
      // console.log('\nDone. Goteee boiiis!!! \n'.rainbow);
      // console.log('\nCtrl+C && Celebrate \n'.bgRed);

      // // Done
      // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
      // await page.goto('https://www.tenor.com/view/done-and-done-ron-swanson-gotchu-gif-10843254', { waitUntil: 'networkidle2' });
      amountOrdered++;
    }
    await page.waitForTimeout(7000);
    //await page.close();
    //await browser.close();
    await mySpinner.stop();
    await process.exit();
    return;
  } catch (error) {
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
    console.log('\n' + error);
  } finally {

  }

}

ubiquitiBot();