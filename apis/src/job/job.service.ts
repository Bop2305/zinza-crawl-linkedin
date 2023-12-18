import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JobDetail } from './job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParams } from 'src/common/dto/pagination.dto';
import { ConditionDto } from './dto/condition.dto';

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(JobDetail)
        private jobDetailRepository: Repository<JobDetail>
    ) { }

    async getAllJobs(pagination: PaginationParams): Promise<JobDetail[]> {
        const {
            orderBy,
            page,
            perpage
        } = pagination

        const offset = (page - 1) * perpage

        const jobs = await this.jobDetailRepository.find({
            skip: offset,
            take: perpage,
            order: {
                created_at: orderBy
            }
        })

        return jobs
    }


    async getJobsByConditions(condition: ConditionDto, pagination: PaginationParams): Promise<JobDetail[]> {
        const {
            orderBy,
            page,
            perpage
        } = pagination

        const offset = (page - 1) * perpage

        const {
            experienceLevel,
            jobType
        } = condition

        const jobs = await this.jobDetailRepository.find({
            where: {
                experience_level: experienceLevel,
                job_type: jobType
            },
            skip: offset,
            take: perpage,
            order: {
                created_at: orderBy
            }
        })

        return jobs
    }

    async searchJobs(search: string, pagination: PaginationParams): Promise<JobDetail[]> {
        const {
            orderBy,
            page,
            perpage
        } = pagination

        const offset = (page - 1) * perpage

        const jobs = await this.jobDetailRepository
        .createQueryBuilder('job_detail')
        .where('required_skills ILIKE :search', {search: `%${search}%`})
        .skip(offset)
        .take(perpage)
        .orderBy('job_detail.created_at', orderBy)
        .getMany()

        return jobs
    }
}
