import { Prisma, TempAccount } from ".prisma/client";
import {
  santaId,
  SantaIdOnly,
  SantaOnFamilyInfo,
  santaOnFamilyInviteSelect,
  tempAcctDetail,
  TempAcctInfo,
} from "@lib/types";
import { isValidObject } from "@lib/utils/validationCheckers";
import { generateVerificationCode } from "@lib/utils/verification";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export type NewInviteBody = {
  email: string;
  familyId: string;
};

// if santa exists, sendInviteEmail, return success
// if santa doesn't exist, create temp account and sendInviteToSignUpWithFamilySignUp

export default async function createInvite(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;

  if (method !== "POST")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const newInvite: NewInviteBody = JSON.parse(body);

  const checkSanta = await prisma.santa.findUnique({
    where: {
      email: newInvite.email,
    },
  });

  if (checkSanta) {
    const newSantaOnFamily = await addSantaToFamily(
      checkSanta.id,
      newInvite.familyId
    );

    if (!newSantaOnFamily)
      return res
        .status(403)
        .json({ message: "Santa is already in that family!" });

    return res.status(200).json({ message: `Santa was added to your family!` });
  }

  const checkTempAccount: TempAccount | null =
    await prisma.tempAccount.findUnique({
      where: {
        email: newInvite.email,
      },
    });

  if (checkTempAccount)
    return res
      .status(403)
      .json({ message: "Temp account with that email already exists!" });

  const newTempAcctOnFamily = await createTempAccountOnFamily(
    newInvite.email,
    newInvite.familyId
  );

  if (newTempAcctOnFamily) {
    // send temporary acct invite email for sign up
    return res.status(200).json({ message: "New account invite sent!" });
  }

  return res
    .status(500)
    .json({ message: "Something went wrong! Please try again later." });
}

const addSantaToFamily = async (
  santaId: string,
  familyId: string
): Promise<SantaOnFamilyInfo | null> => {
  const checkSantaOnFamily = await prisma.santasOnFamilies.findFirst({
    where: {
      family_id: familyId,
      santa_id: santaId,
    },
  });

  if (checkSantaOnFamily) return null;

  const santaOnFamilyRecord: Prisma.SantasOnFamiliesUncheckedCreateInput = {
    family_id: familyId,
    santa_id: santaId,
  };

  const newSantaOnFamily: SantaOnFamilyInfo =
    await prisma.santasOnFamilies.create({
      data: santaOnFamilyRecord,
      select: santaOnFamilyInviteSelect,
    });

  return newSantaOnFamily;
};

const createTempAccountOnFamily = async (
  email: string,
  familyId: string
): Promise<TempAcctInfo> => {
  const tempAccountOnFamily: Prisma.TempAccountUncheckedCreateInput = {
    email: email,
    verification_code: generateVerificationCode(),
    invite_via_family_id: familyId,
  };

  const newTempAcct: TempAcctInfo = await prisma.tempAccount.create({
    data: tempAccountOnFamily,
    select: tempAcctDetail,
  });

  return newTempAcct;
};
