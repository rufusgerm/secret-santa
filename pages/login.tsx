import { LockClosedIcon } from "@heroicons/react/solid";
import { useError, useSuccess } from "@lib/hooks/useAlert";
import useSanta from "@lib/hooks/useSanta";
import { isValidEmail } from "@lib/utils/email";
import { ErrorAlert, SuccessAlert } from "components/Alerts";
import router from "next/router";
import React, { FormEvent, useState } from "react";

export default function Login() {
  const { santa, isLoading } = useSanta({
    redirectTo: "/s",
    redirectIfFound: true,
  });
  const [email, setEmail] = useState<string>("");
  const { isError, errorMsg, triggerErr } = useError();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      triggerErr("Invalid email!");
      return false;
    }

    const response = await fetch("/api/login", {
      method: "POST",
      body: email,
    });

    if (!response.ok) {
      let { message } = await response.json();
      triggerErr(message);

      return false;
    }

    router.push("/email-sent");
  };

  return (
    !isLoading && (
      <>
        {isError && <ErrorAlert err={errorMsg} />}
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Login To Simple Santa
              </h2>
            </div>
            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-6"
              action="#"
              method="POST"
            >
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#146B3A] hover:bg-[#165B33] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C9F61]"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-[#7C9F61] group-hover:text-[#91ac7c]"
                      aria-hidden="true"
                    />
                  </span>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    )
  );
}
