var pm = import("postmark");
let postmark = require("postmark");

export const isValidEmail = (email: string): boolean => {
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
};

type EmailArgs = {
  toAddr: string;
  fromAddr?: string;
  template: EmailTemplate;
};

export type EmailTemplate = {
  templateAlias: TemplateAlias;
  templateModel: ITemplateModel;
};

export enum TemplateAlias {
  INVITE = "user-invitation",
  LOGIN = "magic-login",
}
interface ITemplateModel {
  product_url: string;
  product_name: string;
  company_name: string;
  company_address: string;
}

export const baseTemplate: ITemplateModel = {
  product_url: "simplesanta.net",
  product_name: "SimpleSanta",
  company_name: "Simple Santa",
  company_address: "",
};
export interface InviteTemplateModel extends ITemplateModel {
  invite_sender_name: string;
  action_url: string;
  verification_code: string;
}

export interface LoginTemplateModel extends ITemplateModel {
  user_name: string;
  action_url: string;
}

export const sendEmail = ({
  toAddr,
  fromAddr = "noreply@simplesanta.net",
  template,
}: EmailArgs) => {
  let client = new postmark.ServerClient(
    process.env.NEXT_PUBLIC_POSTMARK_API_KEY
  );

  client.sendEmailWithTemplate({
    From: fromAddr,
    To: toAddr,
    TemplateAlias: template.templateAlias,
    TemplateModel: template.templateModel,
  }).catch((err: string | undefined) => { throw new Error(err)});
};
