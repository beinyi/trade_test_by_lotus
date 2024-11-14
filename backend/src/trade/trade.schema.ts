import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Trade extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date })
  endsAt: Date;

  @Prop({ type: Date })
  turnStartedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Participant' })
  currentParticipant: Types.ObjectId | null;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId }],
    ref: 'Participant',
  })
  participants: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId }], ref: 'Bid' })
  bids: Types.ObjectId[];
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
