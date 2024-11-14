export type TLoadingStatus = "idle" | "pending" | "succeeded" | "failed";

export interface IServerException {
  statusCode: number;
  message: string;
}
