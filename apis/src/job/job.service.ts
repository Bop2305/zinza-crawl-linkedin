import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JobDetail } from './job.entity';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Get list job
 * Get job details
 * search skill, job description
 * filter datetime, level, type, 
 */

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(JobDetail)
        private jobDetailRepository: Repository<JobDetail>
    ) {}

    async getJobs() {
        
    }


    async getJob() {

    }
}
