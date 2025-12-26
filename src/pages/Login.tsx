import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../db/firebase/services/auth.service";
import { Input } from "../components/Input";
import { PasswordInput } from "../components/PasswordInput";
import { useInputValidity } from "../lib/hooks/useInput";
import type { FirebaseError } from "firebase/app";
import { useModal } from "../lib/hooks/useModal";

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
  const { openModal } = useModal();
  const navigate = useNavigate();

  const onBlurIdentifier = (e: FormEvent<HTMLInputElement>) => {
    const input: string = e.currentTarget.value;

    if (input.length === 0) {
      return setIdentifierValidMessage("Email or username is required");
    }

    if (
      !authService.validateEmail(input) &&
      input.includes("@") &&
      !authService.validateUsername(input)
    ) {
      return setIdentifierValidMessage("Email is invalid");
    }
    if (
      !authService.validateEmail(input) &&
      !input.includes("@") &&
      !authService.validateUsername(input)
    ) {
      return setIdentifierValidMessage("Username is invalid");
    }

    return setIdentifierValidMessage("");
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
      .catch((error: FirebaseError) => {
        let title: string = "Unable to Log in";
        let content: string =
          "We cannot log in to your account in the meantime. Please try again later.";

        switch (error.code) {
          case "auth/invalid-email":
            title = "Invalid Email";
            content =
              "We couldn't log in to the account. The email is invalid!";
            break;
          case "auth/user-not-found":
            title = "Invalid Account";
            content =
              "We couldn't log in to the account. The account does not exist!";
            break;
          case "auth/user-disabled":
            title = "Account Disabled";
            content =
              "The account is disabled. Please contact support for further assistance.";
            break;
          case "auth/wrong-password":
            title = "Invalid Password";
            content =
              "Unable to log in to your account. Your password is incorrect!";
            break;
          default:
            break;
        }

        openModal({
          title: title,
          content: (
            <>
              <p className="text-center px-2 my-8 text-text-900">{content}</p>
            </>
          ),
        });
      });
  };

  return (
    <div className="page p-0 justify-center flex-row">
      {window.innerWidth >= 368 && <div className="flex-[43%]"></div>}
      <div className="flex flex-[100%] flex-col justify-around p-10 md:px-50 checkered-bg">
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
              autocomplete="email"
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
                className="p-2 border-2 rounded-md mt-4 cursor-pointer bg-primary-200 hover:bg-primary-300 duration-200"
                type="submit"
                title="Login"
              >
                Login
              </button>
            ) : (
              <button
                className="p-2 border-2 rounded-md mt-4 bg-primary-50"
                title="Fill out the form first!"
                type="button"
                onClick={() => {
                  openModal({
                    title: "Hold Up!",
                    content:
                      "Fill out the form first before clicking that button!",
                  });
                }}
              >
                Login
              </button>
            )}
          </form>

          <div className="flex flex-col items-center mt-4">
            <p className="mb-4">or continue with</p>

            <div className="flex flex-col w-full gap-2">
              <button
                className="flex justify-center items-center gap-2 p-2 border-2 rounded-md cursor-pointer bg-background-50 hover:bg-background-100 duration-200"
                title="Login with Google"
                onClick={async () => authService.signUpViaGoogle()}
              >
                <img
                  className="w-6 h-6"
                  src="/icons/google.svg"
                  alt="Google Icon"
                />
                Google
              </button>
              <button
                className="flex justify-center items-center gap-2 p-2 border-2 rounded-md cursor-pointer bg-background-50 hover:bg-background-100 duration-200"
                title="Login as Guest"
              >
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
      {window.innerWidth >= 368 && <div className="flex-[43%]"></div>}
    </div>
  );
};
