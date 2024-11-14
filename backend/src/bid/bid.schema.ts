import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Bid extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Participant',
    required: true,
  })
  participantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Trade', required: true })
  tradeId: Types.ObjectId;

  @Prop({ required: [true, 'Укажите вашу цену'] })
  amount: number;

  @Prop({ required: [true, 'Укажите срок изготовления'] })
  prodTime: number;

  @Prop({ required: [true, 'Укажите гарантийный срок'] })
  warrantyTime: number;

  @Prop({ required: [true, 'Укажите условия оплаты'] })
  paymentTerms: number;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
