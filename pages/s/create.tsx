import { LockClosedIcon } from "@heroicons/react/outline";
import useError from "@lib/hooks/useError";
import useSanta from "@lib/hooks/useSanta";
import { SantaBaseDetails } from "@lib/types";
import { ErrorAlert } from "components/Alerts";
import { isValidEmail } from "lib/utils/email";
import { TempAcctToSantaDetails } from "pages/api/create/santa";
import React, { FormEvent, useState } from "react";

export default function CreateSanta() {
  const [fName, setFName] = useState<string>("");
  const [lName, setLName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isSubmitDisabled, setIsSumbitDisabled] = useState<boolean>(false);
  const { isError, setIsError, errorMsg, setErrorMsg } = useError({
    msg: "Invalid credentials",
    isActive: false,
  });
  let { mutateSanta } = useSanta({ redirectTo: "/s", redirectIfFound: true });

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("firing!");
    setIsSumbitDisabled(true);

    if (!isValidEmail(email)) {
      setErrorMsg("Invalid email!");
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setErrorMsg("");
      }, 5000);
      setIsSumbitDisabled(false);
      return;
    }

    if (verificationCode.trim().length !== 9) {
      setErrorMsg("Invalid verfication code!");
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setErrorMsg("");
      }, 5000);
      setIsSumbitDisabled(false);
      return;
    }

    const santa: TempAcctToSantaDetails = {
      email: email,
      verification_code: verificationCode,
      first_name: fName,
      last_name: lName,
    };

    const response = await fetch("/api/create/santa", {
      method: "POST",
      body: JSON.stringify(santa),
    });

    if (!response.ok) {
      let { message } = await response.json();
      setErrorMsg(message);
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setErrorMsg("");
      }, 5000);
      setIsSumbitDisabled(false);
      return;
    }
    const newSanta: SantaBaseDetails = await response.json();
    // if response ok, automatically send for login endpoint
    // throw up success alert
    const authRes = await fetch("/api/autologin", {
      method: "POST",
      body: JSON.stringify(newSanta),
    });

    if (authRes.ok) mutateSanta(await authRes.json());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isError && <ErrorAlert err={errorMsg} />}
      <div className="bg-[#165B33] w-full sm:w-3/4 max-w-lg px-12 py-6 shadow-2xl rounded">
        <div className="text-white pb-2 text-3xl font-semibold">
          Create Account
        </div>
        <form onSubmit={(e) => handleCreate(e)}>
          <input
            className="block text-gray-700 p-1 m-4 ml-0 w-full rounded text-lg font-normal placeholder-gray-300"
            id="email"
            type="text"
            placeholder="email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // disabled={true}
            required
          />
          <input
            className="block text-gray-700 p-1 m-4 ml-0 w-full rounded text-lg font-normal placeholder-gray-300"
            id="verification code"
            type="text"
            placeholder="verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            // disabled={true}
            required
          />
          <input
            className="block text-gray-700 p-1 m-4 ml-0 w-full rounded text-lg font-normal placeholder-gray-300"
            id="firstName"
            type="text"
            placeholder="firstName"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            required
          />
          <input
            className="block text-gray-700 p-1 m-4 ml-0 w-full rounded text-lg font-normal placeholder-gray-300"
            id="lastName"
            type="text"
            placeholder="lastName"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent 
            text-sm font-medium rounded-md text-white bg-[#146B3A] hover:bg-[#1d7943]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C9F61]`}
            disabled={isSubmitDisabled}
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon
                className="h-5 w-5 text-[#7C9F61] group-hover:text-[#91ac7c]"
                aria-hidden="true"
              />
            </span>
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
