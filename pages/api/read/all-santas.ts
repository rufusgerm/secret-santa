import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@shared/prisma";
import { Prisma } from ".prisma/client";

const santaId = Prisma.validator<Prisma.SantaArgs>()({
  select: { id: true },
});

export type SantaIdOnly = Prisma.SantaGetPayload<typeof santaId>;

export default async function GetAllIds(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const santas: SantaIdOnly[] = await prisma.santa.findMany({
    select: {
      id: true,
    },
  });

  res.json(santas);
}
