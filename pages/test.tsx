import { Prisma } from ".prisma/client";
import { generateVerificationCode } from "@lib/utils/verification";
import React from "react";

export default function TestingPage() {
  const testRoute = async (e: any) => {
    e.preventDefault();
    const newAcct: Prisma.TempAccountCreateInput = {
      email: "tester@gmail.com",
      verification_code: generateVerificationCode(),
    };
    const fetchTest = await fetch("/api/create/invite", {
      method: "POST",
      body: JSON.stringify(newAcct),
    }).then((r) => r.json());
    console.log(fetchTest);
  };

  return (
    <div>
      <button onClick={testRoute}>Test Api Route</button>
    </div>
  );
}
