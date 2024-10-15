import { Body, Controller, Get, HttpStatus, Param, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { Member } from '@entities/member.entity';
import { MemberInfoDto } from './dto/create-member-info.dto';
import { LineProfileGuard } from '@common/guards/line.guard/line-profile.guard';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(LineProfileGuard)
  @Get(':id')
  async findMemberById(@Param('memberId') memberId: string, @Res() response: any): Promise<Member> {
    console.log('controller:', memberId);
    const member = await  this.memberService.findMemberById(memberId || response.locals.memberId);
    return response.status(HttpStatus.OK).json(member);
  }

  @UseGuards(LineProfileGuard)
  @Patch(':id')
  async updateMember(@Param('id') memberId: string, @Body() member: MemberInfoDto): Promise<void> {
    return this.memberService.updateMember(memberId, member);
  }
}
