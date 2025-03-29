import { ExecutionEnvironment } from "@/types/execution";
// Use puppeteer-core and chrome-aws-lambda
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { LaunchBrowserTask } from "../task/LaunchBrowserTask";

export const LauncherBrowserExecutor = async (
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
): Promise<boolean> => {
  try {
    const websiteUrl = environment.getInput("Website Url");

    // Launch browser using chrome-aws-lambda configuration
    const executablePath = await chromium.executablePath;

    // Check if executablePath is found, Vercel environment might not have it readily available
    // In local dev, chromium.executablePath might be null
    if (!executablePath && process.env.NODE_ENV !== 'development') {
         throw new Error('Chrome executable not found via chrome-aws-lambda. This should not happen on Vercel.');
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: executablePath || puppeteer.executablePath(), // Fallback for local dev
      headless: chromium.headless,
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
