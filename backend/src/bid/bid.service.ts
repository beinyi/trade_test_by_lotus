// bids/bid.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid } from './bid.schema';
@Injectable()
export class BidService {
  constructor(@InjectModel(Bid.name) private readonly bidModel: Model<Bid>) {}

  async addBid({
    tradeId,
    participantId,
    amount,
    prodTime,
    warrantyTime,
    paymentTerms,
  }: Bid): Promise<Bid> {
    const newBid = new this.bidModel({
      tradeId,
      participantId,
      amount,
      prodTime,
      warrantyTime,
      paymentTerms,
    });
    try {
      const savedBid = await newBid.save();

      return savedBid;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errorMessages = Object.values(error.errors).map(
          (err: any) => err.message,
        );

        throw new BadRequestException(errorMessages.join(', '));
      } else {
        throw error;
      }
    }
  }
}
