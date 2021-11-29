import { SantaBaseDetails } from "@lib/types";
import { withSessionRoute } from "@lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(postAccountCreationAutoLogin);

async function postAccountCreationAutoLogin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method !== "POST")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const santa: SantaBaseDetails = JSON.parse(body);

  if (!santa) res.redirect(`/login`);

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
  return res
    .status(500)
    .json({ message: "Something went wrong! Please try again later!" });
}
