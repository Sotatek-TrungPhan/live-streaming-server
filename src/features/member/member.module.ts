import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@infrastructure/database/entities/member.entity';
import { LineProfileGuard } from '@common/guards/line.guard/line-profile.guard';
import { LineService } from '@features/line/line.service';
import { RichMenuEntity } from '@infrastructure/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Member, RichMenuEntity])],
  controllers: [MemberController],
  providers: [MemberService, LineProfileGuard, LineService],
})
export class MemberModule {}
