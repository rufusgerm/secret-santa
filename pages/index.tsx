import { HomeIcon, LockClosedIcon } from "@heroicons/react/outline";
import { useError } from "@lib/hooks/useAlert";
import useSanta from "@lib/hooks/useSanta";
import { isValidEmail } from "@lib/utils/email";
import { ErrorAlert } from "components/Alerts";
import Link from "next/link";
import router from "next/router";
import React, { FormEvent, useState } from "react";

export default function Home() {
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
      <div className="container px-6 py-16 mx-auto flex flex-row justify-center">
        <div className="lg:max-w-lg">
          <h1 className="text-4xl font-semibold text-[#308344] dark:text-white lg:text-6xl">
            Welcome To <span className="text-[#EA4630]">Simple Santa</span>
          </h1>

          <p className="mt-4 text-[#308344] dark:text-gray-400 text-lg lg:text-2xl">
            get started with gift ideas for your family members by{" "}
            <span className="font-medium text-[#EA4630]">
              {!santa?.isLoggedIn ? `logging in` : `going to your homepage`}
            </span>
          </p>
          {!santa?.isLoggedIn && (
            <>
              {isError && <ErrorAlert err={errorMsg} />}
              <form
                onSubmit={handleLogin}
                className="mt-8 space-y-6 "
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
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#308344] hover:bg-[#297439] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C9F61]"
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
            </>
          )}
          {santa?.isLoggedIn && (
            <Link href={`/s/${santa.id}`} passHref>
              <button className="group relative w-full xs:w-3/4 mt-4 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#308344] hover:bg-[#297439] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C9F61]">
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <HomeIcon
                    className="h-5 w-5 text-[#7C9F61] group-hover:text-[#91ac7c]"
                    aria-hidden="true"
                  />
                </span>
                Home
              </button>
            </Link>
          )}
        </div>
      </div>
    )
  );
}
