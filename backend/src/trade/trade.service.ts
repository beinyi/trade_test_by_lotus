import { BadRequestException, Injectable } from '@nestjs/common';
import { Trade } from './trade.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BidService } from 'src/bid/bid.service';
import { ParticipantService } from 'src/participant/participant.service';
import { Bid } from 'src/bid/bid.schema';

@Injectable()
export class TradeService {
  constructor(
    @InjectModel(Trade.name) private tradeModel: Model<Trade>,
    private bidService: BidService,
    private participantService: ParticipantService,
  ) {}

  private tradeParticipants = new Map<string, string[]>();
  tradeTimers = new Map<string, NodeJS.Timeout>();
  turnTimers = new Map<string, NodeJS.Timeout>();
  currentTurnIndex = new Map<string, number>();

  async create(params: {
    title: string;
    participantData: { name: string }[];
  }): Promise<Trade> {
    const participants = await Promise.all(
      params.participantData.map((data) =>
        this.participantService.create(data),
      ),
    );
    const newTrade = new this.tradeModel(params);
    newTrade.endsAt = new Date(Date.now() + 1000 * 60 * 15); // 15 минут
    newTrade.participants = participants.map((participant) => participant.id);
    newTrade.currentParticipant = null;

    return newTrade.save();
  }

  async getTradeById(id: string): Promise<Trade | null> {
    if (Types.ObjectId.isValid(id)) {
      return this.tradeModel
        .findById(id)
        .populate({
          path: 'participants',
          populate: { path: 'bids', model: 'Bid' },
        })

        .exec();
    } else {
      throw new BadRequestException('Неверный идентификатор комнаты');
    }
  }

  async getParticipantByTrade(tradeId: string): Promise<Types.ObjectId[]> {
    const trade = await this.tradeModel.findById(tradeId);
    if (!trade) {
      return [];
    }
    return trade.participants;
  }

  async isParticipantInTrade(
    tradeId: string,
    participantId: string,
  ): Promise<boolean> {
    const trade = await this.tradeModel.findById(tradeId);
    if (!trade) {
      return false;
    }
    return trade.participants.some(
      (participant) => participant.toString() == participantId,
    );
  }

  async isCurrentTurnParticipantInTrade({
    tradeId,
    participantId,
  }: {
    tradeId: string;
    participantId: string;
  }) {
    if (this.currentTurnIndex.has(tradeId)) {
      const participants = await this.getParticipantByTrade(tradeId);
      const currentIndex = this.currentTurnIndex.get(tradeId);
      return participants[currentIndex].toString() === participantId;
    }
    return false;
  }

  async getActiveTrades(): Promise<Trade[]> {
    return this.tradeModel
      .find({ status: 'active' })
      .populate('currentParticipant');
  }

  async getAllTrades(): Promise<Trade[]> {
    return this.tradeModel.find().populate('participants').exec();
  }

  async makeBid(newBid: Bid): Promise<Trade> {
    const tradeId = newBid.tradeId.toString();
    const participantId = newBid.participantId.toString();

    const trade = await this.getTradeById(tradeId);
    if (!trade) throw new BadRequestException('Торги не найдены');
    if (trade.status != 'active')
      throw new BadRequestException('Торги не активны');

    const participant = await this.participantService.getParticipantsById(
      participantId.toString(),
    );
    if (
      !participant ||
      !(await this.isParticipantInTrade(tradeId, participant.id))
    ) {
      throw new BadRequestException('Вы не участвуете в торгах');
    }

    if (
      !(await this.isCurrentTurnParticipantInTrade({
        tradeId,
        participantId,
      }))
    ) {
      throw new BadRequestException('Сейчас не ваш ход');
    }

    const bid = await this.bidService.addBid(newBid);
    trade.bids.push(bid.id);
    participant.bids.push(bid.id);

    await participant.save();
    const updateTrade = (await trade.save()).populate({
      path: 'participants',
      populate: { path: 'bids', model: 'Bid' },
    });
    return updateTrade;
  }
}
