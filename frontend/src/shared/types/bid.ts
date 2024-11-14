import { IParticipant } from "./participant";

export interface IBid {
  amount: number;
  participant: IParticipant;
  prodTime: number;
  warrantyTime: number;
  paymentTerms: number;
}

export interface IBidCreate {
  tradeId: string;
  participantId: string;
  amount: number;
  prodTime: number;
  warrantyTime: number;
  paymentTerms: number;
}
