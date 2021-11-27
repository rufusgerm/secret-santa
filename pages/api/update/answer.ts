import { answerDetail, AnswerInfo } from "@lib/types";
import { NextApiRequest, NextApiResponse } from "next";

type AnswerUpdate = {
  id: number;
  text: string;
};

export default async function updateAnswer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method !== "PUT")
    return res.status(405).json({ message: "Invalid HTTP method for route!" });
  const updatedAnswer: AnswerUpdate = JSON.parse(body);

  const answer: AnswerInfo = await prisma.answer.update({
    where: { id: updatedAnswer.id },
    data: {
      text: updatedAnswer.text,
      modified_at: new Date(),
    },
    select: answerDetail,
  });

  res.status(200).json(answer);
}
