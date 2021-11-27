import { useState } from "react";

type ErrorProps = {
  msg: string;
  isActive: boolean;
};

export default function useError({ msg, isActive }: ErrorProps) {
  const [errorMsg, setErrorMsg] = useState<string>(msg);
  const [isError, setIsError] = useState<boolean>(isActive);

  return { errorMsg, setErrorMsg, isError, setIsError };
}
