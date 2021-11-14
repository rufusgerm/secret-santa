import { IronSessionData } from "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    santa?: {
      id: string | undefined;
      admin?: boolean;
    };
  }
}
