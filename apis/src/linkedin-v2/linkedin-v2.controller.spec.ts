import { Test, TestingModule } from '@nestjs/testing';
import { LinkedinV2Controller } from './linkedin-v2.controller';

describe('LinkedinV2Controller', () => {
  let controller: LinkedinV2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkedinV2Controller],
    }).compile();

    controller = module.get<LinkedinV2Controller>(LinkedinV2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
