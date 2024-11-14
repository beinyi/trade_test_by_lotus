import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './bid.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }])],
  providers: [BidService],
  exports: [BidService],
})
export class BidModule {}
