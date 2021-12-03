import { Answer } from ".prisma/client";
import prisma from "lib/prisma";
import { answerDetail, AnswerInfo } from "@lib/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function CreateAnswer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method !== "POST")
    return res.status(405).json({ message: "Invalid HTTP method for route!" });

  const newAnswer: Answer = JSON.parse(body);

  const checkedAnswer: Answer | null = await prisma.answer.findFirst({
    where: {
      question_id: newAnswer.question_id,
      santa_id: newAnswer.santa_id,
    },
  });

  if (checkedAnswer)
    return res.status(403).json({
      message:
        "This user has already answered this question. Did you mean to edit the answer?",
    });

  const savedAnswer: AnswerInfo = await prisma.answer.create({
    data: newAnswer,
    select: answerDetail,
  });

  if (savedAnswer) return res.status(200).json(savedAnswer);

  return res
    .status(500)
    .json({ message: "Something went wrong! Please try again later!" });
}
