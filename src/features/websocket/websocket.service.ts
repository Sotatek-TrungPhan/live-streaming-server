import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebSocketService {
  constructor(private configService: ConfigService) {}
}
