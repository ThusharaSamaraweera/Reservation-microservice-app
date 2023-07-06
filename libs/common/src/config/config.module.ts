import { Module } from '@nestjs/common';
import {
  ConfigService,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';

@Module({
  imports: [NestConfigModule.forRoot({})],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
