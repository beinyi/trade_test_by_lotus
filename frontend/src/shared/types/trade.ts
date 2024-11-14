import { IBid } from "./bid";
import { IParticipant } from "./participant";

export interface ITradeCreate {
  title: string;
  participantData: { name: string }[];
}

export interface ITrade {
  title: string;
  status: keyof typeof ETradeStatus;
  participants: IParticipant[];
  bids: IBid[];
  _id: string;
  createdAt: Date;
  endsAt: Date;
  currentParticipant: string;
  startPrice: number;
}

export enum ETradeStatus {
  active = "В процессе",
  completed = "Завершен",
  pending = "В ожидании",
}
