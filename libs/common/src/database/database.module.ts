import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => ({
        uri: ConfigService.get<string>('MONGO_DB_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forfeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
