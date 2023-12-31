import { Module } from '@nestjs/common';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate, Experience } from './candidate.entity';

@Module({
  controllers: [CandidateController],
  providers: [CandidateService],
  imports: [
    TypeOrmModule.forFeature([Candidate, Experience])
  ],
  exports: [
    CandidateService
  ]
})
export class CandidateModule {}
