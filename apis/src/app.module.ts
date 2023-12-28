import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './job/job.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkedinModule } from './linkedin/linkedin.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CandidateModule } from './candidate/candidate.module';
import { LinkedinV2Module } from './linkedin-v2/linkedin-v2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DEV_POSTGRES_HOST'),
        port: configService.get('DEV_POSTGRES_PORT'),
        username: configService.get('DEV_POSTGRES_USERNAME'),
        password: configService.get('DEV_POSTGRES_PASSWORD'),
        database: configService.get('DEV_POSTGRES_DATABASE'),
        synchronize: true,
        autoLoadEntities: true
      })
    }),
    JobModule,
    LinkedinModule,
    MailModule,
    ScheduleModule.forRoot(),
    CandidateModule,
    LinkedinV2Module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
