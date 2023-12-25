import { Controller, Get, Query, Res } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import { Response } from 'express';
import { OKSuccessResponse } from 'src/core/success.response';

@Controller('linkedin')
export class LinkedinController {
    constructor(
        private linkedinService: LinkedinService
    ) { }

    @Get('/get-jobs')
    async getJobs(@Res() res: Response): Promise<Response> {
        const linkedinUrlJobs = process.env.LINKEDIN_URL_JOBS_COLLECTIONS
        const data = await this.linkedinService.getJobs(linkedinUrlJobs)

        return new OKSuccessResponse({ metadata: { data } }).send(res)
    }

    @Get('/get-candidate-detail')
    async getCandidateDetail(@Res() res: Response, @Query() query: { url: string }): Promise<Response> {
        const data = await this.linkedinService.getCandidateDetail(query.url)

        return new OKSuccessResponse({ metadata: { data } }).send(res)
    }
}
