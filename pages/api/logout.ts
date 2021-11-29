import { withSessionRoute } from "@lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(logout);

function logout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  req.session.destroy();

  return res.status(200).json({ message: "Logout successful" });
}
