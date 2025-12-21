import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../firebase/services/auth.service";
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";
import { useInputValidity } from "../lib/hooks/useInput";

export const Login = () => {
  const [
    identifierValid,
    identifierValidMessage,
    setIdentifierValidMessage,
    setIdenfierInteracted,
  ] = useInputValidity();
  const [
    passwordValid,
    passwordValidMessage,
    setPasswordValidMessage,
    setPasswordInteracted,
  ] = useInputValidity();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const onBlurIdentifier = (e: FormEvent<HTMLInputElement>) => {
    const input: string = e.currentTarget.value;

    if (input.length === 0) {
      return setIdentifierValidMessage("Email or username is required");
    }

    const identifierValid = !authService.validateEmail(input)
      ? input.includes("@") && !authService.validateUsername(input)
        ? "Email is invalid"
        : !input.includes("@") && !authService.validateUsername(input)
        ? "Username is invalid"
        : ""
      : "";

    setIdentifierValidMessage(identifierValid);
  };

  const onInputPassword = (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;

    const valid = authService.validatePassword(input) ? "" : "Invalid password";
    setPasswordValidMessage(valid);
  };

  const onBlurPassword = (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const valid =
      input.length !== 0
        ? authService.validatePassword(input)
          ? ""
          : "Invalid password"
        : "Password is required";
    setPasswordValidMessage(valid);
  };

  const signInViaEmailAndPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    authService
      .signInViaEmailAndPassword(
        formData.get("identifier") as string,
        formData.get("password") as string
      )
      .then(() => {
        navigate("/home");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="page p-0 flex-row">
      <div className="flex-[43%]"></div>
      <div className="flex flex-[100%] flex-col justify-around p-10 px-50 checkered-bg">
        <h1 className="text-3xl font-bold w-full text-center">Welcome Back!</h1>

        <div className="flex flex-col w-full">
          <form
            className="flex flex-col gap-2 w-full"
            onSubmit={signInViaEmailAndPassword}
          >
            <Input
              id="login-identifier"
              name="identifier"
              type="text"
              label="Email or username"
              action={{
                onBlur: (e) => onBlurIdentifier(e),
                onFocus: () => setIdenfierInteracted(true),
              }}
              validity={{
                isValid: identifierValid,
                errorMessage: identifierValidMessage,
              }}
            />
            <PasswordInput
              id="login-password"
              name="password"
              type="password"
              label="Password"
              action={{
                onChange: (e) => onInputPassword(e),
                onBlur: (e) => onBlurPassword(e),
                onFocus: () => setPasswordInteracted(true),
                onButtonClick: () => setPasswordVisible(!passwordVisible),
              }}
              validity={{
                isValid: passwordValid,
                errorMessage: passwordValidMessage,
              }}
              visible={passwordVisible}
            />
            {identifierValid && passwordValid ? (
              <button
                className="p-2 border-2 mt-4 cursor-pointer bg-primary-200 hover:bg-primary-300 duration-200"
                type="submit"
              >
                Login
              </button>
            ) : (
              <button className="p-2 border-2 mt-4 bg-primary-200/80" disabled>
                Login
              </button>
            )}
          </form>

          <div className="flex flex-col items-center mt-4">
            <p className="mb-4">or continue with</p>

            <div className="flex flex-col w-full gap-2">
              <button className="flex justify-center items-center gap-2 p-2 border-2 cursor-pointer bg-background-50 hover:bg-background-100 duration-200">
                <img
                  className="w-6 h-6"
                  src="/icons/google.svg"
                  alt="Google Icon"
                />
                Google
              </button>
              <button className="flex justify-center items-center gap-2 p-2 border-2 cursor-pointer bg-background-50 hover:bg-background-100 duration-200">
                {" "}
                <img
                  className="w-6 h-6"
                  src="/icons/guest.svg"
                  alt="Guest Icon"
                />
                Guest
              </button>
            </div>
          </div>
        </div>

        <Link to="/join" className="group text-center">
          <span>
            Your first time?{" "}
            <span className="text-accent-300 group-hover:text-accent-500">
              Join now
            </span>
          </span>
        </Link>
      </div>
      <div className="flex-[43%]"></div>
    </div>
  );
};
