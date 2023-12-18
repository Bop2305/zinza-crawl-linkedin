import { Repository } from 'typeorm';
import { JobDetail } from './job.entity';
export declare class JobService {
    private jobDetailRepository;
    constructor(jobDetailRepository: Repository<JobDetail>);
    getJobs(): Promise<void>;
    getJob(): Promise<void>;
}
