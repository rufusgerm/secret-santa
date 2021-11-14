import { sessionOptions, withSessionRoute } from "@lib/withSession";
import { unsealData } from "iron-session";
import { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(Authenticate);

async function Authenticate(req: NextApiRequest, res: NextApiResponse) {
  const seal: string = req.query.seal as string;
  const { santaId } = await unsealData(seal, sessionOptions);

  const santa = await prisma.santa.findFirst({
    where: { id: santaId as string },
  });

  req.session.santa = {
    id: santa?.id,
  };

  await req.session.save();

  res.redirect(`/s/${santa?.id}`);
}
