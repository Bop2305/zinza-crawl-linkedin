import { Controller, Get, Query, Res } from '@nestjs/common';
import { JobService } from './job.service';
import { Response } from 'express';
import { PaginationParams } from 'src/common/dto/pagination.dto';
import { PaginationResponse } from 'src/core/success.response';
import { JobQueryDto } from './dto/job-query.dto';

@Controller('job')
export class JobController {
    constructor(
        private jobService: JobService
    ) { }

    @Get()
    async getAllJobs(
        @Query() { orderBy, page, perPage }: PaginationParams,
        @Res() res: Response
    ): Promise<Response> {
        const pagination = { orderBy, page, perPage }

        const metadata = await this.jobService.getAllJobs(pagination)

        return new PaginationResponse(metadata).send(res)
    }

    @Get('/search')
    async getJobsByCondition(
        @Query() { keywords, experienceLevel, jobType }: JobQueryDto,
        @Query() { orderBy, page, perPage }: PaginationParams,
        @Res() res: Response
    ): Promise<Response> {
        const query = { keywords, experienceLevel, jobType }

        const pagination = { orderBy, page, perPage }

        const metadata = await this.jobService.getJobs(query, pagination)

        return new PaginationResponse(metadata).send(res)
    }
}
