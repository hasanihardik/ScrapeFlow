import { ExecutionEnvironment } from "@/types/execution";
import puppeteer from "puppeteer";
import { getInstalledBrowsers, Browser, Cache, detectBrowserPlatform } from '@puppeteer/browsers';
import { LaunchBrowserTask } from "../task/LaunchBrowserTask";

export const LauncherBrowserExecutor = async (
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> => {
  try {
    const websiteUrl = environment.getInput("Website Url");

    // Find the installed Chrome executable path
    const platform = detectBrowserPlatform();
    if (!platform) {
      throw new Error('Could not detect browser platform.');
    }
    // Use Vercel's recommended cache path /tmp
    const cache = new Cache('/tmp/puppeteer');
    const installedBrowsers = await getInstalledBrowsers({ cacheDir: cache.rootDir });
    const chromeExecutable = installedBrowsers.find(b => b.browser === Browser.CHROME);
    if (!chromeExecutable) {
      // Log the specific cache directory being checked
      environment.log.error(`Chrome executable not found in expected cache directory: ${cache.rootDir}`);
      throw new Error(`Chrome executable not found in cache (${cache.rootDir}). Ensure the build step 'npx @puppeteer/browsers install chrome@stable' completed successfully and used this cache path.`);
    }
    const executablePath = chromeExecutable.executablePath;

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath,
      // Args required for running in serverless/container environments
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
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
