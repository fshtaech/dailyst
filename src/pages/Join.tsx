import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../firebase/services/auth.service";
import { Input } from "../components/Input";
import { useInputValidity } from "../lib/hooks/useInput";
import { PasswordInput } from "../components/PasswordInput";

export const Join = () => {
  const [
    emailValid,
    emailValidMessage,
    setEmailValidMessage,
    setEmailInteracted,
  ] = useInputValidity();
  const [
    usernameValid,
    usernameValidMessage,
    setUsernameValidMessage,
    setUsernameInteracted,
  ] = useInputValidity();
  const [
    passwordValid,
    passwordValidMessage,
    setPasswordValidMessage,
    setPasswordInteracted,
  ] = useInputValidity();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const onBlurEmail = async (e: FormEvent<HTMLInputElement>) => {
    const input: string = e.currentTarget.value;

    if (input.length === 0) {
      return setEmailValidMessage("Email is required");
    }

    const valid = !authService.validateEmail(input)
      ? "Email is invalid"
      : (await authService.emailExists(input))
      ? "Email is already connected to an account"
      : "";

    setEmailValidMessage(valid);
  };

  const onBlurUsername = async (e: FormEvent<HTMLInputElement>) => {
    const input: string = e.currentTarget.value;

    if (input.length === 0) {
      return setUsernameValidMessage("Username is required");
    }

    const valid = !authService.validateUsername(input)
      ? "Username must be at least 6 characters without any special characters"
      : (await authService.usernameExists(input))
      ? "Username is taken"
      : "";

    setUsernameValidMessage(valid);
  };

  const onInputPassword = (e: FormEvent<HTMLInputElement>) => {
    const valid = authService.validatePassword(e.currentTarget.value)
      ? ""
      : "Password must be at least 8 characters, with 1 digit and special character";
    setPasswordValidMessage(valid);
  };

  const onBlurPassword = (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    const valid =
      input.length !== 0
        ? authService.validatePassword(input)
          ? ""
          : "Password must be at least 8 characters, with 1 digit and special character"
        : "Password is required";
    setPasswordValidMessage(valid);
  };

  const signUpViaEmailAndPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    authService
      .signUpViaEmailAndPassword(
        formData.get("email") as string,
        formData.get("username") as string,
        formData.get("password") as string
      )
      .then(() => {
        navigate("/home");
      })
      .catch(() => {
        throw new Error("Unable to create user");
      });
  };

  return (
    <div className="page p-0 flex-row">
      <div className="flex-[43%]"></div>
      <div className="flex flex-[100%] flex-col justify-around p-5 px-50 checkered-bg">
        <h1 className="text-3xl font-bold w-full text-center">
          Ready Join Dailyst?
        </h1>

        <div className="flex flex-col w-full">
          <form
            className="flex flex-col gap-2 w-full"
            onSubmit={signUpViaEmailAndPassword}
          >
            <Input
              id="signup-email"
              name="email"
              type="email"
              label="Email"
              action={{
                onBlur: async (e) => await onBlurEmail(e),
                onFocus: () => setEmailInteracted(true),
              }}
              validity={{
                isValid: emailValid,
                errorMessage: emailValidMessage,
              }}
            />
            <Input
              id="signup-username"
              name="username"
              type="text"
              label="Username"
              action={{
                onBlur: async (e) => await onBlurUsername(e),
                onFocus: () => setUsernameInteracted(true),
              }}
              validity={{
                isValid: usernameValid,
                errorMessage: usernameValidMessage,
              }}
            />
            <PasswordInput
              id="signup-password"
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

            {emailValid && usernameValid && passwordValid ? (
              <button
                className="p-2 border-2 mt-4 cursor-pointer bg-primary-200 hover:bg-primary-300 duration-200"
                type="submit"
              >
                Create
              </button>
            ) : (
              <button className="p-2 border-2 mt-4 bg-primary-200/80" disabled>
                Create
              </button>
            )}
          </form>

          <div className="flex flex-col items-center mt-4">
            <p className="mb-4">or join using</p>

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

        <Link to="/login" className="group text-center">
          <span>
            Already have an account?{" "}
            <span className="text-accent-300 group-hover:text-accent-500">
              Login
            </span>
          </span>
        </Link>
      </div>
      <div className="flex-[43%]"></div>
    </div>
  );
};
