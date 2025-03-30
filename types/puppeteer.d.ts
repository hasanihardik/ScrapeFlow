declare module '@puppeteer/core' {
  export interface Browser {
    newPage(): Promise<Page>;
    close(): Promise<void>;
  }

  export interface Page {
    goto(url: string): Promise<any>;
    close(): Promise<void>;
  }

  export interface LaunchOptions {
    headless?: boolean;
    args?: string[];
    executablePath?: string;
  }

  export function launch(options?: LaunchOptions): Promise<Browser>;
}
