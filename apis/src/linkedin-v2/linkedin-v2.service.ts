import { Injectable, Logger } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { statusLog } from 'src/utils/status-log.util';
import treeKill from 'tree-kill';
import blockedHosts from './blocked-hosts';
import { getHostname } from 'src/utils/linkedin.util';

export interface Location {
  city: string | null;
  province: string | null;
  country: string | null
}

interface RawProfile {
  fullName: string | null;
  title: string | null;
  location: string | null;
  photo: string | null;
  description: string | null;
  url: string;
}

export interface Profile {
  fullName: string | null;
  title: string | null;
  location: Location | null;
  photo: string | null;
  description: string | null;
  url: string;
}

interface RawExperience {
  title: string | null;
  company: string | null;
  employmentType: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  endDateIsPresent: boolean;
  description: string | null;
}

export interface Experience {
  title: string | null;
  company: string | null;
  employmentType: string | null;
  location: Location | null;
  startDate: string | null;
  endDate: string | null;
  endDateIsPresent: boolean;
  durationInDays: number | null;
  description: string | null;
}

interface RawEducation {
  schoolName: string | null;
  degreeName: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface Education {
  schoolName: string | null;
  degreeName: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  durationInDays: number | null;
}

interface RawVolunteerExperience {
  title: string | null;
  company: string | null;
  startDate: string | null;
  endDate: string | null;
  endDateIsPresent: boolean;
  description: string | null;
}

export interface VolunteerExperience {
  title: string | null;
  company: string | null;
  startDate: string | null;
  endDate: string | null;
  endDateIsPresent: boolean;
  durationInDays: number | null;
  description: string | null;
}

export interface Skill {
  skillName: string | null;
  endorsementCount: number | null;
}

interface ScraperUserDefinedOptions {
  sessionCookieValue: string;
  keepAlive?: boolean;
  timeout?: number;
  headless?: boolean;
}

interface ScraperOptions {
  sessionCookieValue: string;
  keepAlive: boolean;
  timeout: number;
  headless: boolean;
  executablePath: string
}

@Injectable()
export class LinkedinV2Service {
  /**
   * Setup puppeteer
   * Athentication linkedin
   */
  selector = {
    USERNAME_SELECTOR: '#username',
    PASSWORD_SELECTOR: '#password',
    CTA_SELECTOR: 'button[data-litms-control-urn="login-submit"]'
  }

  options: ScraperOptions = {
    sessionCookieValue: '',
    keepAlive: false,
    timeout: 60000,
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
  }

  private browser: Browser | null = null

  public async setup() {
    const logSection = 'setup'

    try {
      statusLog(logSection, `Launching puppeteer in the ${this.options.headless ? 'background' : 'foreground'}...`)

      this.browser = await puppeteer.launch({
        headless: this.options.headless,
        args: ['--no-sandbox'],
        timeout: this.options.timeout,
        executablePath: this.options.executablePath
      })

      statusLog(logSection, `Puppeteer launched!`)

      await this.checkLogged()

      statusLog(logSection, 'Done!')
    } catch (error) {
      await this.close()
      throw error
    }
  }

  public async close(page?: Page): Promise<void> {
    const loggerPrefix = 'close'

    try {
      if (page) {
        statusLog(loggerPrefix, 'Closing page...')
        await page.close()
        statusLog(loggerPrefix, 'Closed page!')
      } else {
        statusLog(loggerPrefix, 'Closing browser...')
        await this.browser.close()
        statusLog(loggerPrefix, 'Closed browser!');

        const browserProcessPid = this.browser.process().pid;

        try {
          statusLog(loggerPrefix, `Killing browser process pid: ${browserProcessPid}...`);
          await new Promise<void>((resolve, reject) => {
            treeKill(browserProcessPid, 'SIGKILL', (err) => {
              if (err) {
                reject(`Failed to kill browser process pid: ${browserProcessPid}`);
              } else {
                statusLog(loggerPrefix, `Killed browser pid: ${browserProcessPid} Closed browser.`);
                resolve();
              }
            });
          });
        } catch (killError) {
          // Handle or log the killError if needed
          statusLog(loggerPrefix, `Error while killing browser process: ${killError}`);
        }
      }
    } catch (error) {
      throw error
    }
  }

  public async checkLogged() {
    const logSection = 'check logged';

    const page = await this.createPage();

    statusLog(logSection, 'Checking if we are still logged in...')

    await page.goto('https://www.linkedin.com/login', {
      // waitUntil: 'networkidle2',
      // timeout: this.options.timeout
    })

    const url = page.url()

    const isLoggedIn = !url.endsWith('/login')

    await page.close();

    if (isLoggedIn) {
      statusLog(logSection, 'All good. We are still logged in.')
    } else {
      const errorMessage = 'Bad news, we are not logged in! Your session seems to be expired. Use your browser to login again with your LinkedIn credentials and extract the "li_at" cookie value for the "sessionCookieValue" option.';
      statusLog(logSection, errorMessage)
    }
  }

  public async createPage(): Promise<Page> {
    const logSection = 'create page'

    if (!this.browser) {
      throw new Error('Browser not set.')
    }

    const blockedResources = ['image', 'media', 'font', 'texttrack', 'object', 'beacon', 'csp_report', 'imageset']

    try {
      const page = await this.browser.newPage()

      const firstPage = (await this.browser.pages())[0];
      await firstPage.close()

      const session = await page.target().createCDPSession()
      await page.setBypassCSP(true)
      await session.send('Page.enable')
      await session.send('Page.setWebLifecycleState', {
        state: 'active',
      })

      statusLog(logSection, `Blocking the following resources: ${blockedResources.join(', ')}`)

      const blockedHosts = this.getBlockedHosts();
      const blockedResourcesByHost = ['script', 'xhr', 'fetch', 'document']

      statusLog(logSection, `Should block scripts from ${Object.keys(blockedHosts).length} unwanted hosts to speed up the crawling.`)

      await page.setRequestInterception(true)

      page.on('request', (req) => {
        if (blockedResources.includes(req.resourceType())) {
          return req.abort()
        }

        const hostname = getHostname(req.url());

        // Block all script requests from certain host names
        if (blockedResourcesByHost.includes(req.resourceType()) && hostname && blockedHosts[hostname] === true) {
          statusLog('blocked script', `${req.resourceType()}: ${hostname}: ${req.url()}`);
          return req.abort();
        }

        return req.continue()
      })

      // await page.setUserAgent(this.options.userAgent)

      await page.setViewport({
        width: 1200,
        height: 720
      })

      statusLog(logSection, `Setting session cookie using cookie: ${process.env.LINKEDIN_SESSION_COOKIE_VALUE}`)

      await page.setCookie({
        'name': 'li_at',
        'value': this.options.sessionCookieValue,
        'domain': '.www.linkedin.com'
      })

      statusLog(logSection, 'Session cookie set!')

      statusLog(logSection, 'Done!')

      return page;
    } catch (error) {
      await this.close();

      statusLog(logSection, 'An error occurred during page setup.')
      statusLog(logSection, error.message)

      throw error
    }
  }

  private getBlockedHosts = (): object => {
    const blockedHostsArray = blockedHosts.split('\n');

    let blockedHostsObject = blockedHostsArray.reduce((prev, curr) => {
      const frags = curr.split(' ');

      if (frags.length > 1 && frags[0] === '0.0.0.0') {
        prev[frags[1].trim()] = true;
      }

      return prev;
    }, {});

    blockedHostsObject = {
      ...blockedHostsObject,
      'static.chartbeat.com': true,
      'scdn.cxense.com': true,
      'api.cxense.com': true,
      'www.googletagmanager.com': true,
      'connect.facebook.net': true,
      'platform.twitter.com': true,
      'tags.tiqcdn.com': true,
      'dev.visualwebsiteoptimizer.com': true,
      'smartlock.google.com': true,
      'cdn.embedly.com': true
    }

    return blockedHostsObject;
  }

  public async loginLinkedin(page: Page, url: string) {
    await page.goto(url)

    await Promise.all([
      page.$eval(this.selector.USERNAME_SELECTOR, (element: HTMLInputElement, username: string) => element.value = username, process.env.LINKEDIN_USERNAME),
      page.$eval(this.selector.PASSWORD_SELECTOR, (element: HTMLInputElement, password: string) => element.value = password, process.env.LINKEDIN_PASSWORD),
      page.click(this.selector.CTA_SELECTOR),
      page.waitForNavigation()
    ])
  }
}
