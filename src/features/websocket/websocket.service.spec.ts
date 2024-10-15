import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketService } from './websocket.service';

describe('WebsocketService', () => {
  let service: WebSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebSocketService],
    }).compile();

    service = module.get<WebSocketService>(WebSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
