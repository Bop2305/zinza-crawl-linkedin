import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService
    ) {}

    async sendMail(email: string, username: string): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Your App',
            template: './email',
            context: {
              username,
            },
        })
    }
}
