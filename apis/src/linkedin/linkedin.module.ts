import { Module } from '@nestjs/common';
import { LinkedinController } from './linkedin.controller';
import { LinkedinService } from './linkedin.service';
import { JobModule } from 'src/job/job.module';
import { CandidateModule } from 'src/candidate/candidate.module';

@Module({
  controllers: [LinkedinController],
  providers: [LinkedinService],
  imports: [
    JobModule,
    CandidateModule
  ]
})
export class LinkedinModule {}
