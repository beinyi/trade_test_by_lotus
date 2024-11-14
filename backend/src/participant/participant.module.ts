import { Module } from '@nestjs/common';

import { ParticipantService } from './participant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Participant, ParticipantSchema } from './participant.schema';
import { BidModule } from 'src/bid/bid.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
    ]),
    BidModule,
  ],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
export class ParticipantModule {}
