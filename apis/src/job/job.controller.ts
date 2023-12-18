import { Controller, Get, Injectable, Query, Res } from '@nestjs/common';
import { JobService } from './job.service';
import { Response } from 'express';
import { PaginationParams } from 'src/common/dto/pagination.dto';
import { OKSuccessResponse } from 'src/core/success.response';

@Controller('job')
export class JobController {
    constructor(
        private jobService: JobService
    ) { }

    @Get()
    async getAllJobs(
        @Query() { orderBy, page, perpage }: PaginationParams,
        @Res() res: Response
    ): Promise<Response> {
        const pagination = { orderBy, page, perpage }

        const jobs = await this.jobService.getAllJobs(pagination)

        return new OKSuccessResponse({ metadata: { jobs, pagination } }).send(res)
    }
}
