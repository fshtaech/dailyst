import { useDebugValue, useState } from "react";

export const useInputValidity = (): [
  boolean,
  boolean,
  string,
  React.Dispatch<React.SetStateAction<string>>,
  React.Dispatch<React.SetStateAction<boolean>>,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  useDebugValue("Input Validity");
  const [inputValid, setInputValid] = useState<string>("");
  const [inputInteracted, setInputInteracted] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(true);

  return [
    inputValid.length === 0 && inputInteracted,
    verifying,
    inputValid,
    setInputValid,
    setInputInteracted,
    setVerifying,
  ];
};
