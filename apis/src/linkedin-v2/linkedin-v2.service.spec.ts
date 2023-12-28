import { Test, TestingModule } from '@nestjs/testing';
import { LinkedinV2Service } from './linkedin-v2.service';

describe('LinkedinV2Service', () => {
  let service: LinkedinV2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinkedinV2Service],
    }).compile();

    service = module.get<LinkedinV2Service>(LinkedinV2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
