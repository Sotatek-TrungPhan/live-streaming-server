import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from './common/config';
import { DatabaseModule } from './infrastructure/database/database.module';
import { WebSocketModule } from './features/websocket/websocket.module';
import { LineModule } from './features/line/line.module';
import { json } from 'body-parser';
import { MemberModule } from '@features/member/member.module';

@Module({
  imports: [ConfigModule, DatabaseModule, WebSocketModule, MemberModule, LineModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(json()).forRoutes('*');
  }
}
