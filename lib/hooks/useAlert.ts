import { useEffect, useRef, useState } from "react";

export function useError() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);
  const didMount = useRef(true);

  useEffect(() => {
    if (didMount.current) {
      didMount.current = false;
      return;
    }
    if (errorMsg) {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setErrorMsg("");
      }, 5000);
    }
  }, [errorMsg]);

  const triggerErr = (msg: string) => {
    setErrorMsg(msg);
  };

  return { errorMsg, isError, triggerErr };
}

export function useSuccess() {
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const didMount = useRef(true);

  useEffect(() => {
    if (didMount.current) {
      didMount.current = false;
      return;
    }
    if (successMsg) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSuccessMsg("");
      }, 5000);
    }
  }, [successMsg]);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
  };

  return { successMsg, isSuccess, triggerSuccess };
}
