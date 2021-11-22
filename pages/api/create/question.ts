import { Question } from ".prisma/client";
import prisma from "@lib/prisma";
import { questionDetail, QuestionInfo } from "@lib/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createQuestion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method } = req;

  if (method !== "POST")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const newQuestion: Question = JSON.parse(body);

  const checkQuestion: Question | null = await prisma.question.findFirst({
    where: {
      family_id: newQuestion.family_id,
      text: newQuestion.text,
    },
  });

  if (checkQuestion)
    return res.status(403).json({ message: "That question already exists!" });

  const savedQuestion: QuestionInfo = await prisma.question.create({
    data: newQuestion,
    select: questionDetail,
  });

  if (savedQuestion) return res.status(200).json(savedQuestion);

  return res.status(500).json({
    message: "Something went wrong on the server. Please try again later!",
  });
}
