import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { LineService } from '@features/line/line.service';
import { MemberService } from '@features/member/member.service';

@Injectable()
export class LineProfileGuard implements CanActivate {
  constructor(
    private readonly lineService: LineService,
    private readonly memberService: MemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const authHeader = request.headers['authorization'];
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('missing access-token');
    }

    const isVerified = await this.lineService.verifyAccessToken(accessToken);
    if (!isVerified) {
      throw new UnauthorizedException('not verified');
    }

    const memberLine = await this.lineService.getProfileByToken(accessToken);
    if (!memberLine) {
      throw new NotFoundException('profile not found');
    }

    response.locals = response.locals || {};
    response.locals.memberId = memberLine.userId;
    return true;
  }
}
