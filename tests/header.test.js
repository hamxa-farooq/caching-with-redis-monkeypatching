// const puppeteer = require('puppeteer');
// const sessionFactory = require('./factories/sessionFactory');
// const userFactory = require('./factories/userFactory');
const Page = require('./helpers/page')

// let browser, page;
let page;

beforeEach(async () => {
  // browser = await puppeteer.launch({
  //   headless: false,
  // });
  // page = await browser.newPage();
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
})


test('we can launch a browser', async () => {
  const text = await page.getContentsOf('a.left.brand-logo');
  expect(text).toEqual('Blogster');

})

test('clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
})

test("When signed in shows logout button", async () => {
  await page.login();
  const text = await page.getContentsOf('a[href="/auth/logout"]');
  expect(text).toEqual('Logout');
});

test('', () => {

})
