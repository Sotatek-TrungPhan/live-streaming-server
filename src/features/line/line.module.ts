import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LineController } from './line.controller';
import { LineService } from './line.service';
import { LineMiddlewareGuard } from '../../common/guards/line.guard/line.guard';
import { RichMenu } from '@line/bot-sdk';
import { readFileSync } from 'fs';
import { RichMenuEntity, Member } from '../../infrastructure/database/entities';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberService } from '../member/member.service';
import * as path from 'path';
import axios from 'axios';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Member, RichMenuEntity])],
  controllers: [LineController],
  providers: [MemberService, LineService, LineMiddlewareGuard],
})
export class LineModule implements OnModuleInit {
  constructor(
    @InjectRepository(RichMenuEntity)
    private readonly richMenuRepository: Repository<RichMenuEntity>,
    private readonly configService: ConfigService,
    private readonly lineService: LineService,
  ) {}

  async onModuleInit() {
    const [hasMenuA, hasMenuB] = await Promise.all([
      this.richMenuRepository.findOne({ where: { name: 'menu_a' } }),
      this.richMenuRepository.findOne({ where: { name: 'menu_b' } }),
    ]);
    if (!hasMenuA || !hasMenuB) {
      await this.createRichMenus();
    }
  }

  private async createRichMenus() {
    const menuDemoA = await this.createMenuDemoA();
    const menuDemoB = await this.createMenuDemoB();

    //save rich menu ids to database
    await this.saveRichMenuIds(menuDemoA, menuDemoB);
  }

  private async createMenuDemoA(): Promise<string> {
    const richMenu: RichMenu = {
      size: { width: 2500, height: 1686 },
      selected: true,
      name: 'Menu Demo A',
      chatBarText: 'Menu A',
      areas: [
        // {
        //   bounds: { x: 0, y: 0, width: 1250, height: 100 },
        //   action: {
        //     type: 'richmenuswitch',
        //     richMenuAliasId: 'richmenu-alias-b',
        //     data: 'richmenu-changed-to-b',
        //   },
        // },
        // {
        //   bounds: { x: 1250, y: 0, width: 1250, height: 100 },
        //   action: { type: 'postback', data: 'switch_to_menu_a' },
        // },
        ...this.createMenuAreas(
          [
            { label: 'Item 1', alias: 'richmenu-alias-b', data: 'richmenu-changed-to-b' },
            { label: 'Item 2', uri: 'https://facebook.com', type: 'uri' },
            { label: 'Not implement yet' },
            { label: 'Not implement yet' },
            { label: 'Not implement yet' },
            { label: 'Not implement yet' },
          ],
          0,
          100,
        ),
      ],
    };

    const richMenuId = await this.lineService.createRichMenu(richMenu);
    await this.uploadRichMenuImage(richMenuId, path.join(__dirname, 'assets', 'menu-a.jpg'));
    return richMenuId;
  }

  private async createMenuDemoB(): Promise<string> {
    const richMenu: RichMenu = {
      size: { width: 2500, height: 1686 },
      selected: false,
      name: 'Menu Demo B',
      chatBarText: 'Menu B',
      areas: [
        // // Tab area for Menu A
        // {
        //   bounds: { x: 0, y: 0, width: 1250, height: 100 },
        //   action: { type: 'postback', data: 'switch_to_menu_a' },
        // },
        // // Tab area for Menu B (selected)
        // {
        //   bounds: { x: 1250, y: 0, width: 1250, height: 100 },
        //   action: {
        //     type: 'richmenuswitch',
        //     richMenuAliasId: 'richmenu-alias-a',
        //     data: 'richmenu-changed-to-a',
        //   },
        // },
        ...this.createMenuAreas(
          [
            { label: 'Item 1', alias: 'richmenu-alias-a', data: 'richmenu-changed-to-a' },
            {
              label: 'Item 2',
              uri: 'https://liff.line.me/2006450131-PMgV4ELa',
              type: 'uri',
            },
            { label: 'Item 3', data: 'action=buy', displayText: 'Proceed to purchase' },
            { label: 'Not implement yet' },
            { label: 'Not implement yet' },
            { label: 'Not implement yet' },
          ],
          0,
          100,
        ),
      ],
    };

    const richMenuId = await this.lineService.createRichMenu(richMenu);
    await this.uploadRichMenuImage(richMenuId, path.join(__dirname, 'assets', 'menu-switch-b.jpg'));
    return richMenuId;
  }

  private createMenuAreas(
    items: Array<{ label: string; data?: string; displayText?: string; alias?: string; uri?: string; type?: string }>,
    startY: number,
    tabHeight: number,
  ): any[] {
    const areaWidth = 833;
    const areaHeight = (1686 - tabHeight) / 2;

    return items.map((item, index) => ({
      bounds: {
        x: (index % 3) * areaWidth,
        y: Math.floor(index / 3) * areaHeight + startY + tabHeight,
        width: areaWidth,
        height: areaHeight,
      },
      action: item.data
        ? {
            type: 'postback',
            label: item.label,
            data: item.data,
            displayText: item.displayText,
          }
        : item.alias
          ? {
              type: 'richmenuswitch',
              richMenuAliasId: item.alias,
              data: item.data,
            }
          : item.type === 'uri'
            ? {
                type: 'uri',
                label: item.label,
                uri: item.uri,
              }
            : {
                type: 'message',
                label: item.label,
                text: item.label,
              },
    }));
  }

  private async uploadRichMenuImage(richMenuId: string, imagePath: string): Promise<void> {
    const imageBuffer = readFileSync(path.resolve(imagePath));
    try {
      await axios.post(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          Authorization: `Bearer ${this.configService.get('app.line_channel_access_token')}`,
        },
      });
    } catch (error) {
      console.log('error:', error);
    }
  }

  private async saveRichMenuIds(menuDemoAId: string, menuDemoBId: string): Promise<void> {
    await Promise.all([
      this.lineService.createAliasRichMenu(menuDemoAId, 'richmenu-alias-a'),
      this.lineService.createAliasRichMenu(menuDemoBId, 'richmenu-alias-b'),
    ]);

    await Promise.all([
      this.richMenuRepository.save({
        richMenuId: menuDemoAId,
        isDisplayed: true,
        name: 'menu_a',
        alias: 'richmenu-alias-a',
      }),
      this.richMenuRepository.save({
        richMenuId: menuDemoBId,
        isDisplayed: false,
        name: 'menu_b',
        alias: 'richmenu-alias-b',
      }),
    ]);
  }
}
