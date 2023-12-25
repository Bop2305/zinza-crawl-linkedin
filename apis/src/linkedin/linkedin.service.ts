import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { autoScroll } from 'src/utils/auto-scroll.ulti';
import { getScrollBottom } from 'src/utils/get-scroll-bottom.util';
import * as puppeteer from 'puppeteer';
import { Page } from 'puppeteer';
import { JobService } from 'src/job/job.service';
import { JobDetail } from 'src/job/job.entity';
import { CandidateService } from 'src/candidate/candidate.service';
import { CreateCandidateDto } from 'src/candidate/dto/create-candidate.dto';

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
        private jobService: JobService,
        private candidateService: CandidateService
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
            timeout: 180000,
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

    async getJobs(url: string) {
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

            const jobs = []

            for (const id of jobList) {
                await page.waitForSelector(`li#${id}`, {
                    timeout: 180000,
                });

                await page.click(`li#${id}`)

                await page.screenshot({
                    path: `img-${id}.png`
                })

                const jobUrl = await page.url()

                const job = await this.getJobDetail(page)

                const createJob = { ...job, linkedin_url: jobUrl }

                await this.jobService.createJob(createJob)

                jobs.push(createJob)
            }

            return jobs
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await browser.close()
        }
    }

    async getCandidateDetail(url: string) {
        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            args: ['--no-sandbox'],
        });

        try {
            const page = await browser.newPage()

            await page.setViewport({
                width: 1920,
                height: 1080
            })

            await autoScroll(page)

            await this.loginLinkedin(page)

            await page.goto(url)

            await page.waitForSelector('body')

            await page.screenshot({
                path: `img.png`
            })

            const [
                fullname,
                intro,
                countries,
                contact,
            ] = await Promise.all([
                page.$eval('h1.text-heading-xlarge.inline.t-24.v-align-middle.break-words', ele => ele.innerText),
                page.$eval('div.text-body-medium.break-words', ele => ele.innerText),
                page.$eval('span.text-body-small.inline.t-black--light.break-words', ele => ele.innerText),
                page.$eval('a#top-card-text-details-contact-info', ele => ele.href),
            ])

            await page.waitForSelector('.artdeco-list__item')

            const experiences = await page.evaluate(() => {
                const section = document.querySelector('main.scaffold-layout__main section:nth-child(5)')
                const dataList = Array.from(section.querySelectorAll('.artdeco-list__item')).map(item => {
                    const getValue = (selector) => (item.querySelector(selector)?.textContent.trim() || null);

                    const role = getValue('.t-bold > span');
                    const companyName = getValue('.t-14.t-normal > span');
                    const duration = getValue('.t-14.t-normal.t-black--light > span');
                    const location = getValue('.t-14.t-normal.t-black--light:nth-child(4) > span');

                    return { role, companyName, duration, location };
                });

                return dataList;
            });

            const education = await page.evaluate(() => {
                const section = document.querySelector('main.scaffold-layout__main section:nth-child(6)')
                const dataList = Array.from(section.querySelectorAll('.artdeco-list__item')).map(item => {
                    const getValue = (selector) => (item.querySelector(selector)?.textContent.trim() || null);

                    const universityName = getValue('.t-bold > span');
                    const majors = getValue('.t-14.t-normal > span');
                    const duration = getValue('.t-14.t-normal.t-black--light > span');

                    return { universityName, duration, majors };
                });

                return dataList;
            });

            const profile = {
                fullname,
                intro,
                countries,
                contact,
            } as CreateCandidateDto

            const createdCandidate = await this.candidateService.createCandidate(profile)

            const createdExperiences = []
            for (const item of experiences) {
                const newExperience = { ...item, company_name: item.companyName, candidate: createdCandidate.id }
                const createdExperience = await this.candidateService.createExperience(newExperience)
                createdExperiences.push(createdExperience)
            }

            return { ...createdCandidate, experiences: createdExperiences }

        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await browser.close()
        }
    }
}
