import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './trade.schema';
import { BidModule } from 'src/bid/bid.module';
import { ParticipantModule } from 'src/participant/participant.module';
import { TradeWebSocket } from './trade.websocket';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trade.name, schema: TradeSchema }]),
    BidModule,
    ParticipantModule,
  ],
  controllers: [TradeController],
  providers: [TradeService, TradeWebSocket],
  exports: [TradeService],
})
export class TradeModule {}
