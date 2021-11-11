import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@shared/prisma";
import { Santa } from ".prisma/client";
import { generateVerificationCode } from "@shared/utils/verification";

export default async function createSanta(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST')
        return res.status(405).json({ message: "Invalid HTTP Method! Not allowed." })
    
    const newSanta: Santa = JSON.parse(req.body);

    const checkSanta: Santa | null = await prisma.santa.findUnique({
        where: {
            email: newSanta.email
        }
    })

    if (checkSanta)
        return res.status(403).json({ message: "User with that email already exists!" })

    newSanta.verification_code = generateVerificationCode();
    
    const savedSanta: Santa = await prisma.santa.create({
        data: newSanta
    })

    console.log({ savedSanta })
    
    res.json(savedSanta);
}