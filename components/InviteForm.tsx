import { useError, useSuccess } from "@lib/hooks/useAlert";
import { fetcher } from "@lib/hooks/useSanta";
import { isValidEmail } from "@lib/utils/email";
import { NewInviteBody } from "pages/api/create/invite";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import { ErrorAlert, SuccessAlert } from "./Alerts";

const InviteForm = ({
  inviteSenderName,
  familyId,
}: {
  inviteSenderName: string;
  familyId: string;
}): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [isSendDisabled, setIsSendDisabled] = useState<boolean>(false);
  const { errorMsg, isError, triggerErr } = useError();
  const { successMsg, isSuccess, triggerSuccess } = useSuccess();
  const { mutate } = useSWR(`/api/read/family?id=${familyId}`, fetcher);

  const handleInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSendDisabled(true);

    if (!isValidEmail(email)) {
      triggerErr("Invalid email!");
      setIsSendDisabled(false);
      return;
    }

    const emailToInvite: NewInviteBody = {
      email,
      familyId,
      inviteSenderName,
    };

    const response = await fetch("/api/create/invite", {
      method: "POST",
      body: JSON.stringify(emailToInvite),
    });

    if (!response.ok) {
      const { message } = await response.json();
      triggerErr(`${message}`);
      setIsSendDisabled(false);
      return;
    }
    setEmail("");
    setIsSendDisabled(false);
    triggerSuccess("Invite successfully sent!");
    mutate();
  };

  return (
    <div className="flex my-2 justify-center">
      {isError && <ErrorAlert err={errorMsg} />}
      {isSuccess && <SuccessAlert msg={successMsg} />}
      <form
        className="flex flex-col justify-center xl:justify-between w-3/4 sm:w-1/2 md:w-2/5"
        onSubmit={handleInvite}
      >
        <h2 className="w-full text-lg xs:text-xl sm:text-2xl text-[#308344] text-center mx-auto my-auto font-extrabold tracking-tight">
          <label>Invite someone to this family:</label>
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-label="Email"
          className={`mt-1 my-auto rounded border-gray-400 h-8
          focus:outline-none focus:ring focus:ring-[#7C9F61] focus:ring-opacity-80 w-full`}
        />
        <button
          type="submit"
          className={`px-4 py-2 mt-2 font-medium tracking-wide text-white 
          capitalize transition-colors duration-200 transform bg-[#308344]
          rounded-md hover:bg-[#297439] focus:outline-none focus:ring
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
