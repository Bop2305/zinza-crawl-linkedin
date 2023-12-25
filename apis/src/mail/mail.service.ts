import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from '@nestjs/schedule/node_modules/cron';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private readonly schedulerRegistry: SchedulerRegistry
    ) { }

    sendMail(option: ISendMailOptions) {
        try {
            this.mailerService.sendMail(option)
        } catch (error) {
            console.error(`Error sending email to ${option.to}`)
            throw new HttpException(`Error sending email to ${option.to}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    scheduleEmail(email, username) {
        const jobId = `emailJob_${uuid()}`
        const cronExpression = '45 * * * * *'

        const job = new CronJob(cronExpression, () => {
            this.sendMail({
                to: email,
                subject: 'Welcome to Your App',
                template: './email',
                context: {
                    username,
                },
            })
        })

        this.schedulerRegistry.addCronJob(jobId, job)
        job.start();
    }

    cancelAllScheduledEmails() {
        this.schedulerRegistry.getCronJobs().forEach((job) => {
            job.stop();
        })
    }
}

