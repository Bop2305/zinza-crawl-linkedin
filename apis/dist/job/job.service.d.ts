import { Repository } from 'typeorm';
import { JobDetail } from './job.entity';
import { PaginationParams } from 'src/common/dto/pagination.dto';
import { ConditionDto } from './dto/condition.dto';
export declare class JobService {
    private jobDetailRepository;
    constructor(jobDetailRepository: Repository<JobDetail>);
    getAllJobs(pagination: PaginationParams): Promise<JobDetail[]>;
    getJobsByConditions(condition: ConditionDto, pagination: PaginationParams): Promise<JobDetail[]>;
    searchJobs(search: string, pagination: PaginationParams): Promise<JobDetail[]>;
}
