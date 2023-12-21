import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(
        private mailService: MailService
    ) {}

    @Post('/schedule')
    async scheduleEmail() {
        this.mailService.scheduleEmail('canhthong05@gmail.com', 'Test')
    }

    @Post('/cancel-schedule')
    async cancelAllScheduledEmails() {
        this.mailService.cancelAllScheduledEmails()
    }
}
