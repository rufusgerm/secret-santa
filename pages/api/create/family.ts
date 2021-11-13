import { Family } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { FamilyIdOnly } from "../read/all-families";

export default async function createSanta(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<FamilyIdOnly | void> {
  if (req.method !== "POST")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const newFamily: Family = JSON.parse(req.body);

  const checkFamily: Family | null = await prisma.family.findUnique({
    where: {
      name: newFamily.name,
    },
  });

  if (checkFamily)
    return res
      .status(403)
      .json({ message: "Family with that name already exists!" });

  const savedFamily: FamilyIdOnly = await prisma.family.create({
    data: newFamily,
    select: {
      id: true,
    },
  });

  res.json(savedFamily);
}
