import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { JobDetail } from './job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParams } from 'src/common/dto/pagination.dto';
import { JobQueryDto } from './dto/job-query.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { getTotalPage } from 'src/utils/get-total-page.util';

@Injectable()
export class JobService {
    constructor(
        @InjectRepository(JobDetail)
        private jobDetailRepository: Repository<JobDetail>
    ) { }

    async getAllJobs(pagination: PaginationParams): Promise<PaginationResponseDto<JobDetail>> {
        const {
            orderBy,
            page,
            perPage
        } = pagination

        const offset = (page - 1) * perPage

        const [data, count] = await this.jobDetailRepository.findAndCount({
            skip: offset,
            take: perPage,
            order: {
                created_at: orderBy
            }
        })

        const totalPage = getTotalPage(count, perPage)

        return {
            data,
            totalPage,
            perPage,
            currentPage: page,
            orderBy
        }
    }

    async getJobs(query: JobQueryDto, pagination: PaginationParams) {
        const {
            orderBy,
            page,
            perPage
        } = pagination

        const offset = (page - 1) * perPage

        const {
            experienceLevel,
            jobType,
            keywords
        } = query

        const [data, count] = await this.jobDetailRepository.findAndCount({
            where: {
                experience_level: experienceLevel,
                job_type: jobType,
                required_skills: Like('%' + keywords + '%')
            },
            skip: offset,
            take: perPage,
            order: {
                created_at: orderBy
            }
        })

        console.log('data', data);
        

        const totalPage = getTotalPage(count, perPage)

        return {
            data,
            totalPage,
            perPage,
            currentPage: page,
            orderBy
        }
    }
}
