import { Santa, TempAccount } from ".prisma/client";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createSanta(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<TempAccount | void> {
  const { body, method } = req;

  if (method !== "POST")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const newInvite: TempAccount = JSON.parse(body);

  const checkSanta: Santa | null = await prisma.santa.findUnique({
    where: {
      email: newInvite.email,
    },
  });

  if (checkSanta)
    return res
      .status(403)
      .json({ message: "User with that email already exists!" });

  const checkTempAccount: TempAccount | null =
    await prisma.tempAccount.findUnique({
      where: {
        email: newInvite.email,
      },
    });

  if (checkTempAccount)
    return res
      .status(403)
      .json({ message: "User with that email already exists!" });

  const newTempAcct: TempAccount = await prisma.tempAccount.create({
    data: newInvite,
  });

  if (!newTempAcct)
    return res.status(500).json({
      message: "Something went wrong on the server. Please try again later!",
    });

  return res.send({ ok: true });
}
