import { sessionOptions, withSessionRoute } from "lib/withSession";
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

  console.log(`MagicLink: http://localhost:3000/auth?seal=${seal}`);
  //   await sendEmail(
  //     user.email,
  //     "Magic link",
  //     `Hey there ${user.name}, <a href="">click here to login</a>.`
  //   );

  return res.status(200).json({ message: "Please check your email to login!" });
}
