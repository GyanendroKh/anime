import { Test, TestingModule } from '@nestjs/testing';
import { SpiderController } from './spider.controller';
import { SpiderService } from './spider.service';

describe('SpiderController', () => {
  let spiderController: SpiderController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SpiderController],
      providers: [SpiderService]
    }).compile();

    spiderController = app.get<SpiderController>(SpiderController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(spiderController.getHello()).toBe('Hello World!');
    });
  });
});
