import { IronSessionData } from "iron-session";

declare module "iron-session" {
  interface IronSessionData {
    santa?: {
      id: string;
      first_name: string;
      last_name: string;
      admin?: boolean;
      isLoggedIn: boolean = false;
    };
  }
}
