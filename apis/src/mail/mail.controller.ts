import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(
        private mailService: MailService
    ) {}

    @Post('/demo')
    async sendMail() {
        await this.mailService.sendMail('canhthong05@gmail.com', 'Test')
    }
}
