import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { middleware } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LineMiddlewareGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    return new Promise<boolean>((resolve, reject) => {
      middleware({
        channelSecret: this.configService.get<string>('app.line_channel_secret'),
        channelAccessToken: this.configService.get<string>('app.line_channel_access_token'),
      })(req, res, (err) => {
        resolve(true);
        console.log('err:', err);
      });
    });
  }
}
