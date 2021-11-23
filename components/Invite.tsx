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
    <div className="flex my-2 justify-center">
      <form
        className="flex flex-col xl:flex-row justify-center w-1/2"
        onSubmit={handleInvite}
      >
        <h2 className="text-3xl mx-2 my-auto font-extrabold tracking-tight text-gray-900 sm:text-xl">
          <label>Invite someone to this family: </label>
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
          className="mx-2 my-auto rounded border-gray-400"
        />
        <button
          type="submit"
          className={`px-4 py-2 mt-2 xl:mt-0 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-[#146B3A] rounded-md hover:bg-[#165B33] focus:outline-none focus:ring focus:ring-[#7C9F61] focus:ring-opacity-80`}
        >
          Send Invite
        </button>
      </form>
    </div>
  );
};

export default InviteForm;
