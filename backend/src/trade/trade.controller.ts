import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TradeService } from './trade.service';
import { ParticipantService } from 'src/participant/participant.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('api/trade')
export class TradeController {
  constructor(
    private readonly tradesService: TradeService,
    private readonly participantsService: ParticipantService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllTrades() {
    return this.tradesService.getAllTrades();
  }

  // создание новой комнаты
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTrade(
    @Body()
    createTrade: {
      title: string;
      participantData: { name: string }[];
    },
  ) {
    return (await this.tradesService.create(createTrade)).populate({
      path: 'participants',
      populate: { path: 'bids', model: 'Bid' },
    });
  }

  // старт торгов
  @UseGuards(JwtAuthGuard)
  @Post(`:tradeId/start`)
  async startTrade(@Param('tradeId') tradeId: string) {
    const trade = await this.tradesService.getTradeById(tradeId);

    if (!trade) {
      throw new NotFoundException('Комната не найдена');
    }

    if (trade.status === 'active') {
      throw new NotFoundException('Комната уже активна');
    }

    trade.status = 'active';
    await trade.save();

    return {
      message: `Торги в комнате ${trade.title} запущены`,
      trade,
    };
  }

  // вход участника по ссылке
  @Get(':tradeId/join/:participantId')
  async joinTrade(
    @Param('tradeId') tradeId: string,
    @Param('participantId') participantId: string,
  ) {
    const trade = await this.tradesService.getTradeById(tradeId);

    if (!trade) {
      throw new NotFoundException('Комната не найдена');
    }

    const participant =
      await this.participantsService.getParticipantsById(participantId);

    if (!participant) {
      throw new NotFoundException('Участник не найден');
    }

    const isParticipantInTrade = await this.tradesService.isParticipantInTrade(
      tradeId,
      participantId,
    );
    if (!isParticipantInTrade) {
      throw new NotFoundException('Вы не учавствуете в данных торгах');
    }

    return {
      message: `Вы вошли в комнату ${trade.title}`,
    };
  }
}
