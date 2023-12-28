import { Controller, Get, Res } from '@nestjs/common';
import { LinkedinV2Service } from './linkedin-v2.service';
import { OKSuccessResponse } from 'src/core/success.response';
import { Response } from 'express';

@Controller('linkedin-v2')
export class LinkedinV2Controller {
    constructor(
        private linkedinV2Service: LinkedinV2Service
    ) {}

    @Get('/search/candidate')
    async searchCandidate(@Res() res: Response): Promise<Response> {
        this.linkedinV2Service.options.sessionCookieValue = process.env.LINKEDIN_SESSION_COOKIE_VALUE
        this.linkedinV2Service.options.keepAlive = true
        
        await this.linkedinV2Service.setup()

        //await this.linkedinV2Service.searchCandidate('https://www.linkedin.com/search/results/people/?keywords=react&origin=SWITCH_SEARCH_VERTICAL&sid=Hy%3A')

        return new OKSuccessResponse({}).send(res)
    }
}
