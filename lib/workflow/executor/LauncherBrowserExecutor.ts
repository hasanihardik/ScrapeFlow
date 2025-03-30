import { ExecutionEnvironment } from "@/types/execution";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowserTask";

export const LauncherBrowserExecutor = async (
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> => {
  try {
    const websiteUrl = environment.getInput("Website Url");

    let browser;
    
    if (process.env.VERCEL === '1' && process.env.BROWSERLESS_TOKEN) {
      // Use browserless.io in production
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`
      });
    } else {
      // Use local Chrome in development
      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--hide-scrollbars',
          '--disable-web-security'
        ],
        headless: true
      });
    }
    environment.log.info("Browser started successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();

    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info("Opened page at:" + websiteUrl);
    return true;
  } catch (err: any) {
    environment.log.error(err.message);
    return false;
  }
};
/*breakpoint */
