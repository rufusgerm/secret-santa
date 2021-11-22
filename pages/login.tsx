import useSanta from "@lib/hooks/useSanta";
import { isValidEmail } from "@lib/utils/email";
import { FormEvent, useState } from "react";

export default function SignIn() {
  const { santa, isLoading } = useSanta({
    redirectTo: "/s",
    redirectIfFound: true,
  });
  const [email, setEmail] = useState<string>("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      console.log("Invalid email!");
      return false;
    }

    const response = await fetch("/api/login", {
      method: "POST",
      body: email,
    });

    if (!response.ok) {
      let msg = await response.json();
      console.log(
        `Status ${response.status}-${response.statusText} - ${msg.message}`
      );
      return false;
    }
  };

  return (
    !isLoading && (
      <div>
        <h1>Login with your Email!</h1>
        <div>
          <form onSubmit={handleLogin}>
            <div>
              <label>Email </label>
              <input
                type="email"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    )
  );
}
