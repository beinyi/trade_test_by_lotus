import { IBid } from "./bid";

export interface IParticipant {
  name: string;
  _id: string;
  bids: IBid[];
}
