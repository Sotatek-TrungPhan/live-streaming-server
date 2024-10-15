import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../../infrastructure/database/entities/member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async findMemberById(memberId: string): Promise<Member> {
    const member = await this.findMemberByLineId(memberId);
    console.log('service:',member)
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }
    return member;
  }

  async listMembers(): Promise<Member[]> {
    return this.memberRepository.find();
  }

  async updateMember(memberId: string, params: Partial<Member>): Promise<void> {
    console.log('memberId:', memberId);
    console.log('params:', params);
    const member = await this.findMemberByLineId(memberId);
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found`);
    }
    if (!member.isRegistered) {
      Object.assign(member, { ...params, isRegistered: true });
    } else {
      Object.assign(member, params);
    }
    await this.memberRepository.save(member);
  }

  async deleteMember(memberId: string): Promise<void> {
    const member = await this.findMemberById(memberId);
    await this.memberRepository.remove(member);
  }

  async findMemberByLineId(lineId: string): Promise<Member> {
    const member = await this.memberRepository.findOne({ where: { lineId } });
    return member;
  }

  async createMember(member: Member): Promise<Member> {
    const newMember = await this.memberRepository.create(member);
    return this.memberRepository.save(newMember);
  }
}
