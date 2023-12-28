import { Module } from '@nestjs/common';
import { LinkedinV2Controller } from './linkedin-v2.controller';
import { LinkedinV2Service } from './linkedin-v2.service';

@Module({
  controllers: [LinkedinV2Controller],
  providers: [LinkedinV2Service]
})
export class LinkedinV2Module {}
