import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [DatabaseModule, ConfigModule],
})
export class CommonModule {}
