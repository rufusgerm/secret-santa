import { Family } from ".prisma/client";
import { FamilyIdOnly } from "@lib/types";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";

export default async function createFamily(
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

  if (savedFamily) res.status(200).json(savedFamily);

  return res.status(500).json({
    message: "Something went wrong on the server. Please try again later!",
  });
}
