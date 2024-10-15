import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { LineMiddlewareGuard } from '../../common/guards/line.guard/line.guard';
import { LineService } from './line.service';
import { WebhookEvent } from '@line/bot-sdk';

@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post('webhook')
  @UseGuards(LineMiddlewareGuard)
  async handleLineWebhook(@Body() { events }: { events: WebhookEvent[] }) {
    console.log('events:', events);
    for (const event of events) {
      if (event.type === 'postback') {
        await this.lineService.handlePostBack(event);
      } else {
        await this.lineService.handleEvent(event as any);
      }
    }
  }
}
