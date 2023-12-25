import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Candidate, Experience } from './candidate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class CandidateService {
    constructor(
        @InjectRepository(Candidate)
        private candidateRepository: Repository<Candidate>,
        @InjectRepository(Experience)
        private experienceRepository: Repository<Experience>
    ) { }

    async createCandidate(createCandidate: CreateCandidateDto): Promise<Candidate> {
        const candidate = await this.candidateRepository.findOne({
            where: {
                fullname: createCandidate.fullname,
                contact: createCandidate.contact
            }
        })

        if (candidate) throw new HttpException('Candidate already exist', HttpStatus.BAD_REQUEST)

        const newCandidate = await this.candidateRepository.create(createCandidate)
        const createdCandidate = await this.candidateRepository.save(newCandidate)

        if (!createdCandidate) throw new HttpException('Create candidate failed', HttpStatus.INTERNAL_SERVER_ERROR)

        return createdCandidate
    }

    async createExperience(createExperience: CreateExperienceDto): Promise<Experience> {
        const foundCandidate = await this.candidateRepository.findOne({ where: { id: createExperience.candidate } })

        if (!foundCandidate) throw new HttpException('Candidate not found', HttpStatus.BAD_REQUEST)

        const newExperience = await this.experienceRepository.create(createExperience)
        const createdExperience = await this.experienceRepository.save(newExperience)

        if (!createdExperience) throw new HttpException('Create experience failed', HttpStatus.INTERNAL_SERVER_ERROR)

        return createdExperience
    }
}
