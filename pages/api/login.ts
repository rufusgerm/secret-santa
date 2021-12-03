import { sessionOptions, withSessionRoute } from "lib/withSession";
import { sealData } from "iron-session";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import {
  baseTemplate,
  EmailTemplate,
  LoginTemplateModel,
  sendEmail,
  TemplateAlias,
} from "@lib/utils/email";

export default withSessionRoute(Login);

async function Login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const email: string = req.body;

  const santa = await prisma.santa.findUnique({
    where: { email: email },
  });

  if (!santa) {
    return res
      .status(404)
      .json({ message: "Santa with that email does not exist!" });
  }

  const seal = await sealData(
    {
      id: santa?.id,
    },
    {
      password: sessionOptions.password,
    }
  );

  const loginTemplate: LoginTemplateModel = {
    ...baseTemplate,
    user_name: santa.first_name,
    action_url: `${process.env.NEXT_PUBLIC_SERVER}/auth?seal=${seal}`,
  };

  const emailTemplate: EmailTemplate = {
    templateAlias: TemplateAlias.LOGIN,
    templateModel: loginTemplate,
  };

  try {
    sendEmail({ toAddr: santa.email, template: emailTemplate });
  } catch (err) {
    return res.status(500).json(err);
  }

  return res.status(200).json({ message: "Please check your email to login!" });
}
