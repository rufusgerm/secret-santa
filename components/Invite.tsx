import { isValidEmail } from "@lib/utils/email";
import { generateVerificationCode } from "@lib/utils/verification";
import { Prisma } from "@prisma/client";
import { FormEvent, useState } from "react";

const InviteForm = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const handleInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) console.log("Invalid email!");

    const tempAcct: Prisma.TempAccountCreateInput = {
      email: email,
      verification_code: generateVerificationCode(),
    };
  };

  return (
    <div>
      <form onSubmit={handleInvite}>
        <label>Invite someone to this family: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
        />
        <span> </span>
        <button type="submit">Send Invite</button>
      </form>
    </div>
  );
};

export default InviteForm;
