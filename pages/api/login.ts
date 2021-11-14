import { sessionOptions, withSessionRoute } from "@lib/withSession";
import { sealData } from "iron-session";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

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
    res.statusMessage = "Santa with that email does not exist!";
    return res.status(404).send({ ok: false });
  }

  const seal = await sealData(
    {
      santaId: santa?.id,
    },
    {
      password: sessionOptions.password,
    }
  );

  console.log(`MagicLink: http://localhost:3000/api/authenticate?seal=${seal}`);
  //   await sendEmail(
  //     user.email,
  //     "Magic link",
  //     `Hey there ${user.name}, <a href="">click here to login</a>.`
  //   );

  res.send({ ok: true });
}
