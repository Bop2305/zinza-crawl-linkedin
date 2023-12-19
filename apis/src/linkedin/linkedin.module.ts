import { Module } from '@nestjs/common';
import { LinkedinController } from './linkedin.controller';
import { LinkedinService } from './linkedin.service';
import { JobModule } from 'src/job/job.module';

@Module({
  controllers: [LinkedinController],
  providers: [LinkedinService],
  imports: [
    JobModule
  ]
})
export class LinkedinModule {}
