import { sessionOptions, withSessionRoute } from "lib/withSession";
import { unsealData } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";
import { SantaIdOnly } from "./read/all-santas";
import useSanta from "@lib/useSanta";

export default withSessionRoute(Authenticate);

async function Authenticate(req: NextApiRequest, res: NextApiResponse) {
  const seal: string = req.query.seal as string;
  const { id } = await unsealData<SantaIdOnly>(seal, sessionOptions);

  const santa = await prisma.santa.findFirst({
    where: { id: id as string },
  });

  if (!santa) res.redirect(`/login`);

  req.session.santa = {
    id: santa?.id as string,
    isLoggedIn: true,
  };

  await req.session.save();

  res.json(req.session.santa);
}
