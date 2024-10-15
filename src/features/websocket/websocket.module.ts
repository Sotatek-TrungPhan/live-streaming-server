import { Module } from '@nestjs/common';
import { WebSocketService } from './websocket.service';
import { WebSocketGateway } from './websocket.gateway';

@Module({
  providers: [WebSocketGateway, WebSocketService],
})
export class WebSocketModule {}
