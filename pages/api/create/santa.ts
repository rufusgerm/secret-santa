import { Santa } from ".prisma/client";
import { SantaBaseDetails, santaId, SantaIdOnly } from "@lib/types";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export type TempAcctToSantaDetails = {
  email: string;
  verification_code: string;
  first_name: string;
  last_name: string;
};

export default async function createSanta(
  req: NextApiRequest,
  res: NextApiResponse<SantaIdOnly | { message: string }>
) {
  const { body, method } = req;

  if (method !== "POST")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const newSanta: TempAcctToSantaDetails = JSON.parse(body);

  const checkSanta: Santa | null = await prisma.santa.findUnique({
    where: {
      email: newSanta.email,
    },
  });

  if (checkSanta)
    return res
      .status(403)
      .json({ message: "User with that email already exists!" });

  // validate temps list
  const checkTempAcct = await prisma.tempAccount.findFirst({
    where: {
      email: newSanta.email,
      verification_code: newSanta.verification_code,
    },
  });

  if (!checkTempAcct)
    return res.status(400).json({
      message: "Either your email or verification code is incorrect!",
    });

  const savedSanta: SantaBaseDetails = await prisma.santa.create({
    data: {
      email: newSanta.email,
      first_name: newSanta.first_name,
      last_name: newSanta.last_name,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
    },
  });

  if (savedSanta) {
    const updateTempAcct = await prisma.tempAccount.update({
      where: {
        id: checkTempAcct.id,
      },
      data: { did_activate: true },
    });
    const addedSantaToFamily = await prisma.santasOnFamilies.create({
      data: {
        santa_id: savedSanta.id,
        family_id: checkTempAcct.invite_via_family_id,
      },
    });

    return res.status(200).json(savedSanta);
  }

  return res.status(500).json({ message: "Something went wrong!" });
}
