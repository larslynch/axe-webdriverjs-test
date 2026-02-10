const { Builder, By } = require('selenium-webdriver');
const AxeBuilder = require('@axe-core/webdriverjs');
const { expect } = require('chai');
const chrome = require('selenium-webdriver/chrome');



describe('Deque Mars demo page test suite', function () {
  // Increase timeout for WebDriver + axe analysis
  this.timeout(30000);

  let driver;
  // set Chrome options best for headless analysis
  let options = new chrome.Options();
  options.addArguments("--headless=new");
  options.addArguments("--disable-gpu");
  options.addArguments("--window-size=1920,1080");

  before(async () => {
    driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
    await driver.get('https://dequeuniversity.com/demo/mars');
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Ensure the main navigation has loaded', async () => {
    // wait for the main nav bar to load before analysis
    const nav = await driver.findElement(By.css('#main-nav'));
    const displayed = await nav.isDisplayed();

    expect(nav).to.exist;
    expect(displayed).to.equal(true);
  });

  it('Perform an accessibility scan of the page with axe-core', async () => {
    const results = await new AxeBuilder(driver).analyze();

    // Log full results (including violations) to the console
    // Very verbose and a simple foreach could better show relevant information
     console.log('AXE scan results:', JSON.stringify(results, null, 2));

    // Basic structure assertions
    expect(results).to.have.property('violations');
    expect(results.violations).to.be.an('array');
    
    // assert that there are no critical violations
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical'
    );

    expect(criticalViolations, 'Critical accessibility violations found').to
      .have.lengthOf(0);
  });
});


