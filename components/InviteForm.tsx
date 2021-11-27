import useError from "@lib/hooks/useError";
import { fetcher } from "@lib/hooks/useSanta";
import { isValidEmail } from "@lib/utils/email";
import { NewInviteBody } from "pages/api/create/invite";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import { ErrorAlert } from "./Alerts";

const InviteForm = ({ familyId }: { familyId: string }): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [isSendDisabled, setIsSendDisabled] = useState<boolean>(false);
  const { errorMsg, setErrorMsg, isError, setIsError } = useError({
    msg: "",
    isActive: false,
  });
  const { mutate } = useSWR(`/api/read/family?id=${familyId}`, fetcher);

  const handleInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSendDisabled(true);

    if (!isValidEmail(email)) {
      console.log("Invalid email!");
      return;
    }

    const emailToInvite: NewInviteBody = {
      email,
      familyId,
    };

    const response = await fetch("/api/create/invite", {
      method: "POST",
      body: JSON.stringify(emailToInvite),
    });

    if (!response.ok) {
      const { message } = await response.json();
      setErrorMsg(message);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setErrorMsg("");
      }, 5000);
    }
    setEmail("");
    setIsSendDisabled(false);
    mutate();
  };

  return (
    <div className="flex my-2 justify-center">
      {isError && <ErrorAlert err={errorMsg} />}
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
          className={`mx-2 my-auto rounded border-gray-400 
          focus:outline-none focus:ring focus:ring-[#7C9F61] focus:ring-opacity-80`}
        />
        <button
          type="submit"
          className={`px-4 py-2 mt-2 xl:mt-0 font-medium tracking-wide text-white 
          capitalize transition-colors duration-200 transform bg-[#146B3A]
          rounded-md hover:bg-[#165B33] focus:outline-none focus:ring
          focus:ring-[#7C9F61] focus:ring-opacity-80`}
          disabled={isSendDisabled}
        >
          Send Invite
        </button>
      </form>
    </div>
  );
};

export default InviteForm;
