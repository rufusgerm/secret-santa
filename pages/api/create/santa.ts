import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Santa } from ".prisma/client";
import { generateVerificationCode } from "lib/utils/verification";
import { SantaIdOnly } from "../read/santa";

export default async function createSanta(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<SantaIdOnly | void> {
  const { body, method } = req;
  if (method !== "POST")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const newSanta: Santa = JSON.parse(body);

  const checkSanta: Santa | null = await prisma.santa.findUnique({
    where: {
      email: newSanta.email,
    },
  });

  if (checkSanta)
    return res
      .status(403)
      .json({ message: "User with that email already exists!" });

  const savedSanta: SantaIdOnly = await prisma.santa.create({
    data: newSanta,
    select: {
      id: true,
    },
  });

  res.json(savedSanta);
}
