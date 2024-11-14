import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Participant extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Trade' })
  trade: Types.ObjectId;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId }],
    ref: 'Bid',
  })
  bids: Types.ObjectId[];
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
