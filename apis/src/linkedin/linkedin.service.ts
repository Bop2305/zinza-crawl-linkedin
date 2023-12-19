import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { autoScroll } from 'src/utils/auto-scroll.ulti';
import { getScrollBottom } from 'src/utils/get-scroll-bottom.util';
import * as puppeteer from 'puppeteer';
import { Page } from 'puppeteer';
import { JobService } from 'src/job/job.service';
import { JobDetail } from 'src/job/job.entity';

@Injectable()
export class LinkedinService {
    linkedinUrlLogin = process.env.LINKEDIN_URL_LOGIN
    linkedinUrlJobs = process.env.LINKEDIN_URL_JOBS_COLLECTIONS
    selector = {
        USERNAME_SELECTOR: '#username',
        PASSWORD_SELECTOR: '#password',
        CTA_SELECTOR: 'button[data-litms-control-urn="login-submit"]'
    }
    linkedinUsername = process.env.LINKEDIN_USERNAME
    linkedinPassword = process.env.LINKEDIN_PASSWORD

    constructor(
        private jobService: JobService
    ) { }

    async loginLinkedin(page: Page) {
        await page.goto(this.linkedinUrlLogin)

        await Promise.all([
            page.$eval(this.selector.USERNAME_SELECTOR, (element: HTMLInputElement, username: string) => element.value = username, process.env.LINKEDIN_USERNAME),
            page.$eval(this.selector.PASSWORD_SELECTOR, (element: HTMLInputElement, password: string) => element.value = password, process.env.LINKEDIN_PASSWORD),
            page.click(this.selector.CTA_SELECTOR),
            page.waitForNavigation()
        ])
    }

    async getJobDetail(page: Page): Promise<Partial<JobDetail>> {
        await page.waitForSelector('#job-details', {
            timeout: 300000,
        })

        const job = await page.evaluate(() => {
            const containers = document.querySelectorAll('.jobs-search__job-details--wrapper')

            let jobDetail = {} as Partial<JobDetail>

            containers.forEach(container => {
                const position = container.querySelector('.job-details-jobs-unified-top-card__job-title-link')?.textContent.trim() || null

                const companyLinkElement = container.querySelector('.app-aware-link') as HTMLAnchorElement | null;
                const companyName = companyLinkElement?.textContent.trim() || null
                const companyLink = companyLinkElement?.href || null

                const type = container.querySelector('.job-details-jobs-unified-top-card__job-insight > span > span:nth-child(1)')?.textContent.trim() || null
                const time = container.querySelector('.job-details-jobs-unified-top-card__job-insight > span > span:nth-child(2)')?.textContent.trim() || null
                const level = container.querySelector('.job-details-jobs-unified-top-card__job-insight > span > span:nth-child(3)')?.textContent.trim() || null
                const skills = container.querySelector('.app-aware-link.job-details-how-you-match__skills-item-subtitle.t-14.overflow-hidden')?.textContent.trim() || null

                const jobDetails = container.querySelector('#job-details')
                const spanElement = jobDetails.querySelector('span')
                const pElements = spanElement ? Array.from(spanElement.querySelectorAll('p')) : []
                const ulElements = spanElement ? Array.from(spanElement.querySelectorAll('ul')) : []

                let aboutJob = ''

                pElements.forEach(ele => {
                    aboutJob += ele?.textContent.trim() || ''
                })

                ulElements.forEach(ele => {
                    aboutJob += ele?.textContent.trim() || ''
                })

                return jobDetail = {
                    job_position: position,
                    company_name: companyName,
                    company_link: companyLink,
                    job_type: type,
                    work_schedule: time,
                    experience_level: level,
                    job_description: aboutJob,
                    required_skills: skills
                }
            })

            return jobDetail
        })

        return job
    }

    async handleNextPage(page: Page) {
        return await page.evaluate(() => {
            const ulElement = document.querySelector('.jobs-search-results-list__pagination > ul')
            const liElements = ulElement ? Array.from(ulElement.querySelectorAll('li')) : []

            const result = liElements.find(ele => {
                const button = ele.querySelector('button')
                return button.ariaCurrent ? button.ariaCurrent : false
            })

            const currentPage = result ? Number(result.getAttribute('data-test-pagination-page-btn')) : 1

            return currentPage + 1
        })
    }

    async getJobs(url) {
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            args: ['--no-sandbox'],
        });

        try {
            const page = await browser.newPage()

            await page.setViewport({
                width: 1200,
                height: 800
            })

            await autoScroll(page)

            await page.screenshot({
                path: `img.png`
            })

            await this.loginLinkedin(page)

            await page.goto(url)

            await page.waitForSelector('.scaffold-layout__list')

            const jobList = await page.evaluate(async () => {
                const container = document.querySelector('.scaffold-layout__list > div > ul')
                const jobItems = container ? Array.from(container.querySelectorAll('li.ember-view')) : []

                return jobItems.map(ele => ele.id)
            })

            for (const id of jobList) {  
                await page.waitForSelector(`li#${id}`, {
                    timeout: 300000,
                });

                await page.click(`li#${id}`)

                await page.screenshot({
                    path: `img-${id}.png`
                })

                const job = await this.getJobDetail(page)

                const jobUrl = await page.url()

                await this.jobService.createJob({ ...job, linkedin_url: jobUrl })

                // const positionScroll = await getScrollBottom(page, 'jobs-search-results-list')
                // console.log('positionScroll', positionScroll);
                
                // if(positionScroll >= 0 && positionScroll < 1) this.handleNextPage(page)
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await browser.close()
        }
    }
}
