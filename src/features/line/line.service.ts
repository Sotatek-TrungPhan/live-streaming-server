import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client, FlexMessage, Message, PostbackEvent, ReplyableEvent, RichMenu, WebhookEvent } from '@line/bot-sdk';
import { Member, RichMenuEntity } from '../../infrastructure/database/entities';
import { MemberService } from '../member/member.service';
import { FLEX_MESSAGE } from '../../constants';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class LineService {
  private lineBotClient;
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(RichMenuEntity)
    private readonly richMenuRepository: Repository<RichMenuEntity>,
    private readonly memberService: MemberService,
    private readonly configService: ConfigService,
  ) {
    this.lineBotClient = new Client({
      channelSecret: this.configService.get('app.line_channel_secret'),
      channelAccessToken: this.configService.get('app.line_channel_access_token'),
    });
  }
  async handleEvent(event: WebhookEvent & ReplyableEvent): Promise<void> {
    const replyObject: Message | Message[] | null = null;

    if (event.source.type === 'user') {
      if (!event.source.userId) {
        throw new Error('lineId invalid');
      }

      let member = await this.memberService.findMemberByLineId(event.source.userId);

      if (!member) {
        const lineProfile = await this.getProfile(event.source.userId);
        if (!lineProfile) {
          return;
        }

        const richMenuId = await this.richMenuRepository.findOne({ where: { name: 'menu_a' } });
        if (richMenuId) {
          await this.linkRichMenuToUser(event.source.userId, richMenuId.richMenuId);
        }
        member = await this.memberRepository.save({
          displayName: lineProfile.displayName,
          lineId: lineProfile.userId,
          picUrl: lineProfile.pictureUrl,
          isFriends: true,
          isRegistered: false,
        });
      }

      switch (event.type) {
        case 'follow':
          await this.handleFollow(member);
          break;
        case 'unfollow':
          await this.handleUnfollow(member);
          break;
      }

      if (replyObject) {
        await this.replyMessage(event.replyToken, replyObject);
      }
    }
  }

  async handlePostBack(event: PostbackEvent): Promise<void> {
    const { data } = event.postback;
    const member = await this.memberService.findMemberByLineId(event.source.userId);
    if (!member) {
      return;
    }

    switch (data) {
      case 'richmenu-changed-to-a':
        const richMenuIdA = (await this.richMenuRepository.findOne({ where: { name: 'menu_a' } })).richMenuId;

        await this.linkRichMenuToUser(member.lineId, richMenuIdA);
        break;
      case 'richmenu-changed-to-b':
        const richMenuIdB = (await this.richMenuRepository.findOne({ where: { name: 'menu_b' } })).richMenuId;

        await this.linkRichMenuToUser(member.lineId, richMenuIdB);
        break;
      case 'action=buy':
        await this.sendFlexMessage(member.lineId);
        break;
    }
  }

  private async handleFollow(member: Member): Promise<void> {
    await this.memberRepository.update(member.memberId, { isFriends: true });
  }

  private async handleUnfollow(member: Member): Promise<void> {
    await this.memberRepository.delete(member.memberId);
  }

  async sendFlexMessage(lineId: string): Promise<FlexMessage> {
    try {
      const member = await this.memberService.findMemberByLineId(lineId);
      if (!member.isRegistered) {
        return await this.lineBotClient.pushMessage(lineId,{
          type: 'text',
          text: 'You should register first',
        });
      }
      return await this.lineBotClient.pushMessage(lineId, {
        type: 'flex',
        altText: 'Brown Cafe',
        contents: FLEX_MESSAGE,
      });
    } catch (error) {
      console.error('error:', error);
      throw error;
    }
  }

  async getProfile(lineId: string) {
    return this.lineBotClient.getProfile(lineId).catch(() => null);
  }
  async replyMessage(replyToken: string, message: Message | Message[]) {
    return this.lineBotClient.replyMessage(replyToken, message);
  }
  async createRichMenu(richMenu: RichMenu) {
    return this.lineBotClient.createRichMenu(richMenu);
  }

  async createAliasRichMenu(richMenuId: string, alias: string) {
    return this.lineBotClient.createRichMenuAlias(richMenuId, alias);
  }
  async setRichMenuImage(richMenuId: string, imagePath: string) {
    return this.lineBotClient.setRichMenuImage(richMenuId, imagePath);
  }
  async linkRichMenuToUser(userId: string, richMenuId: string) {
    return this.lineBotClient.linkRichMenuToUser(userId, richMenuId);
  }

  async deleteAllRichMenu() {
    return this.lineBotClient.deleteAllRichMenu();
  }

  async verifyAccessToken(token: string): Promise<boolean> {
    const lineLoginChannelId = this.configService.get<string>('app.line_login_channel_id');
    try {
      console.log('Verifying token:', token);
      console.log('Line Login Channel ID:', lineLoginChannelId);

      const response = await axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${token}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      const oauth2 = response.data;
      console.log('OAuth2 response:', oauth2);

      if (oauth2.error) {
        console.error(`OAuth error: ${oauth2.error_description}`);
        return false;
      }
      if (oauth2.client_id !== lineLoginChannelId.toString()) {
        console.error(`Client ID mismatch. Expected: ${lineLoginChannelId}, Received: ${oauth2.client_id}`);
        return false;
      }

      if (oauth2.expires_in <= 0) {
        console.error(`Token expired. Expires in: ${oauth2.expires_in}`);
        return false;
      }

      console.log('Token verified successfully');
      return true;
    } catch (e) {
      console.error('Error verifying access token:', e);
      if (axios.isAxiosError(e)) {
        console.error('Axios error response:', e.response?.data);
      }
      return false;
    }
  }

  async getProfileByToken(token: string): Promise<any | null> {
    try {
      const profile = await axios('https://api.line.me/v2/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }).then((r) => r.data);
      return profile;
    } catch (e) {
      return null;
    }
  }
}
