import { JobService } from './job.service';
import { Response } from 'express';
import { PaginationParams } from 'src/common/dto/pagination.dto';
export declare class JobController {
    private jobService;
    constructor(jobService: JobService);
    getAllJobs({ orderBy, page, perpage }: PaginationParams, res: Response): Promise<Response>;
}
