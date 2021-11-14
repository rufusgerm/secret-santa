import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from ".prisma/client";

const santaId = Prisma.validator<Prisma.SantaSelect>()({
  id: true,
});

export type SantaIdOnly = Prisma.SantaGetPayload<{
  select: typeof santaId;
}>;

export default async function AllSantaIds(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const santas: SantaIdOnly[] = await prisma.santa.findMany({
    select: santaId,
  });

  res.json(santas);
}
