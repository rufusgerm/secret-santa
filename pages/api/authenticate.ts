import { Santa } from ".prisma/client";
import prisma from "lib/prisma";
import { SantaIdOnly } from "@lib/types";
import { unsealData } from "iron-session";
import { sessionOptions, withSessionRoute } from "lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(Authenticate);

async function Authenticate(req: NextApiRequest, res: NextApiResponse) {
  const seal: string = req.query.seal as string;
  const { id } = await unsealData<SantaIdOnly>(seal, sessionOptions);

  const santa: Santa | null = await prisma.santa.findFirst({
    where: { id: id as string },
  });

  if (!santa) return res.status(400).json({ message: "Invalid login link!" });

  if (santa) {
    req.session.santa = {
      id: santa.id,
      first_name: santa!.first_name,
      last_name: santa!.last_name,
      isLoggedIn: true,
    };
    await req.session.save();

    return res.status(200).json(req.session.santa);
  }
}
