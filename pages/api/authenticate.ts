import { Santa } from ".prisma/client";
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

  if (!santa) res.redirect(`/login`);

  if (santa) {
    req.session.santa = {
      id: santa.id,
      first_name: santa!.first_name,
      last_name: santa!.last_name,
      isLoggedIn: true,
    };
    await req.session.save();

    res.json(req.session.santa);
  }
}
