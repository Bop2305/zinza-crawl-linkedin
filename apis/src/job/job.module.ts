import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { JobDetail } from './job.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [JobController],
  providers: [JobService],
  imports: [
    TypeOrmModule.forFeature([JobDetail])
  ],
  exports: [
    JobService
  ]
})
export class JobModule {}
