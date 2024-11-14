import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Participant } from './participant.schema';
import { Model } from 'mongoose';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectModel(Participant.name) private participantModel: Model<Participant>,
  ) {}

  async create(params: { name: string }): Promise<Participant> {
    const newParticipant = new this.participantModel(params);
    return newParticipant.save();
  }

  async getParticipantsById(id: string): Promise<Participant> {
    return this.participantModel.findById(id).exec();
  }
}
