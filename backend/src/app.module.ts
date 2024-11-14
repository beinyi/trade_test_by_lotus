import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BidModule } from './bid/bid.module';
import { ParticipantModule } from './participant/participant.module';
import { TradeModule } from './trade/trade.module';
import { TradeController } from './trade/trade.controller';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    TradeModule,
    ParticipantModule,
    BidModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController, TradeController, AuthController],
  providers: [AppService],
})
export class AppModule {}
