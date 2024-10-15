import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfigs from './config';
@Module({
  imports: [
    NestConfigModule.forRoot({
      ignoreEnvFile: true,
      envFilePath: '.env',
      load: [appConfigs],
      isGlobal: true,
    }),
  ],
})
export class ConfigModule {}
