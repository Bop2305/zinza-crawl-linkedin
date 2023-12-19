import { Controller, Get, Res } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import { Response } from 'express';
import { OKSuccessResponse } from 'src/core/success.response';

@Controller('linkedin')
export class LinkedinController {
    constructor(
        private linkedinService: LinkedinService
    ) {}

    @Get('/get-jobs')
    async getJobs(@Res() res: Response): Promise<Response> {
        const linkedinUrlJobs = process.env.LINKEDIN_URL_JOBS_COLLECTIONS
        await this.linkedinService.getJobs(linkedinUrlJobs)

        return new OKSuccessResponse({}).send(res)
    }
}
