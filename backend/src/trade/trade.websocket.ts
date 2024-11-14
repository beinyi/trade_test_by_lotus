import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TradeService } from './trade.service';

import { NotFoundException } from '@nestjs/common';
import { Bid } from 'src/bid/bid.schema';

@WebSocketGateway({ namespace: '/trade', cors: { origin: '*' } })
export class TradeWebSocket
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(private readonly tradeService: TradeService) {}

  afterInit() {
    console.log('WebSocket сервер инициализирован');
  }

  handleConnection(client: Socket) {
    console.log(`Клиент подключился: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Клиент отключился: ${client.id}`);
  }

  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinTrade')
  async handleJoinTrade(
    client: Socket,
    payload: { tradeId: string; participantId?: string },
  ): Promise<void> {
    const { tradeId, participantId } = payload;
    if (participantId) {
      const isParticipantInTrade = await this.tradeService.isParticipantInTrade(
        tradeId,
        participantId,
      );
      if (!isParticipantInTrade) {
        client.emit('error', 'Вы не участвуете в этих торгах');
        return;
      }
    }
    client.join(tradeId);

    this.getTradeData(tradeId).then((data) => {
      client.emit('tradeData', data);
    });
  }

  @SubscribeMessage('addBid')
  handleAddBid(client: Socket, payload: Bid): void {
    const tradeId = payload.tradeId.toString();
    this.tradeService
      .makeBid(payload)
      .then((trade) => {
        this.server.to(tradeId).emit('tradeData', trade);
        this.startTurnTimer(tradeId);
      })
      .catch((error) => {
        client.emit('error', error.message);
      });
  }

  @SubscribeMessage('skipTurn')
  async handleSkipTurn(
    client: Socket,
    payload: { tradeId: string; participantId: string },
  ) {
    const { tradeId } = payload;
    const isMyTurn =
      await this.tradeService.isCurrentTurnParticipantInTrade(payload);
    if (!isMyTurn) {
      client.emit('error', 'Сейчас не ваш ход');
      return;
    }
    this.startTurnTimer(tradeId);
  }

  @SubscribeMessage('startTrade')
  async handleStartTrade(client: Socket, payload: { tradeId: string }) {
    const { tradeId } = payload;
    const trade = await this.tradeService.getTradeById(tradeId);
    if (!trade) {
      throw new NotFoundException('Комната не найдена');
    }
    if (trade.status === 'active') {
      throw new NotFoundException('Комната уже активна');
    }
    trade.status = 'active';
    trade.save().then((data) => {
      this.server.to(tradeId).emit('tradeData', data);
    });

    this.startTradeTimer(tradeId);
  }

  @SubscribeMessage('stopTrade')
  async handleStopTrade(client: Socket, payload: { tradeId: string }) {
    const { tradeId } = payload;
    const trade = await this.tradeService.getTradeById(tradeId);
    if (!trade) {
      throw new NotFoundException('Комната не найдена');
    }
    trade.status = 'completed';
    trade.save().then((data) => {
      this.server.to(tradeId).emit('tradeData', data);
      this.server.to(tradeId).emit('tradeEnded', { tradeId });
      this.stopTradeTimer(tradeId);
    });
  }

  async getTradeData(tradeId: string) {
    const trade = await this.tradeService.getTradeById(tradeId);
    return trade;
  }

  startTradeTimer(tradeId: string) {
    const tradeEnd = Date.now() + 15 * 60 * 1000; // 15 минут
    const interval = setInterval(() => {
      const timeLeft = tradeEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        this.tradeService.getTradeById(tradeId).then((trade) => {
          trade.status = 'completed';
          trade.save().then((data) => {
            this.server.to(tradeId).emit('tradeData', data);
          });
        });
        this.tradeService.tradeTimers.delete(tradeId);
        this.server.to(tradeId).emit('tradeEnded', { tradeId });
        return;
      }

      this.server.to(tradeId).emit('tradeTimer', { tradeId, timeLeft });
    }, 1000);

    this.tradeService.tradeTimers.set(tradeId, interval);
    this.startTurnTimer(tradeId);
  }

  async startTurnTimer(tradeId: string) {
    if (this.tradeService.turnTimers.has(tradeId)) {
      const existingTimer = this.tradeService.turnTimers.get(tradeId);
      if (existingTimer) {
        clearInterval(existingTimer);
      }
    }

    const participants = await this.tradeService.getParticipantByTrade(tradeId);
    const prevIndex = this.tradeService.currentTurnIndex.get(tradeId) ?? -1;

    const nextIndex = (prevIndex + 1) % participants.length;
    const currentParticipant = participants[nextIndex];

    const turnEnd = Date.now() + 30 * 1000; // 30 секунд

    const turnInterval = setInterval(() => {
      const remainingTime = Math.floor(turnEnd - Date.now());
      if (remainingTime < 0) {
        this.server.to(tradeId).emit('turnEnded', {
          tradeId,
          participantId: currentParticipant,
        });
        clearInterval(turnInterval);

        if (this.tradeService.tradeTimers.has(tradeId)) {
          this.startTurnTimer(tradeId);
        } else {
          this.tradeService.turnTimers.delete(tradeId);
        }
        return;
      } else {
        this.server.to(tradeId).emit('turnTimer', {
          tradeId,
          participantId: currentParticipant,
          remainingTime,
        });
      }
    }, 1000);

    this.tradeService.turnTimers.set(tradeId, turnInterval);
    this.tradeService.currentTurnIndex.set(tradeId, nextIndex);
  }

  stopTradeTimer(tradeId: string) {
    if (this.tradeService.tradeTimers.has(tradeId)) {
      clearInterval(this.tradeService.tradeTimers.get(tradeId));
      this.tradeService.tradeTimers.delete(tradeId);
      clearInterval(this.tradeService.turnTimers.get(tradeId));
      this.tradeService.turnTimers.delete(tradeId);
      this.tradeService.currentTurnIndex.delete(tradeId);
    }
  }
}
