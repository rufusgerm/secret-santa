import { withSessionRoute } from "@lib/withSession";
import { NextApiRequest, NextApiResponse } from "next";

export type SantaSession = {
  id: string;
  isLoggedIn: boolean;
};

export default withSessionRoute(Session);

async function Session(
  req: NextApiRequest,
  res: NextApiResponse<SantaSession>
) {
  if (req.session.santa) {
    //   Later grab list of families and whether admin or not
    res.json({
      ...req.session.santa,
      isLoggedIn: true,
    });
  } else {
    res.json({
      id: "",
      isLoggedIn: false,
    });
  }
}
