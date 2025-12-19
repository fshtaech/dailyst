import { useDebugValue, useState } from "react";

export const useInputValidity = (): [
  boolean,
  string,
  React.Dispatch<React.SetStateAction<string>>,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  useDebugValue("Input Validity");
  const [inputValid, setInputValid] = useState<string>("");
  const [inputInteracted, setInputInteracted] = useState<boolean>(false);

  return [
    inputValid.length === 0 && inputInteracted,
    inputValid,
    setInputValid,
    setInputInteracted,
  ];
};
