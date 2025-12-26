import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../db/firebase/services/auth.service";
import { Input } from "../components/Input";
import { useInputValidity } from "../lib/hooks/useInput";
import { PasswordInput } from "../components/PasswordInput";
import { useModal } from "../lib/hooks/useModal";

export const Join = () => {
  const [
    emailValid,
    emailVerifying,
    emailValidMessage,
    setEmailValidMessage,
    setEmailInteracted,
    setEmailVerifying,
  ] = useInputValidity();
  const [
    usernameValid,
    usernameVerifying,
    usernameValidMessage,
    setUsernameValidMessage,
    setUsernameInteracted,
    setUsernameVerifying,
  ] = useInputValidity();
  const [
    passwordValid,
    passwordVerifying,
    passwordValidMessage,
    setPasswordValidMessage,
    setPasswordInteracted,
    setPasswordVerifying,
  ] = useInputValidity();
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { openModal } = useModal();
  const navigate = useNavigate();

  const onBlurEmail = async (e: FormEvent<HTMLInputElement>) => {
    const input: string = e.currentTarget.value;

    if (input.length === 0) {
      setEmailValidMessage("Email is required");
      return setEmailVerifying(false);
    }

    if (!authService.validateEmail(input)) {
      setEmailValidMessage("Email is invalid");
      return setEmailVerifying(false);
    }

    try {
      const exists = await authService.emailExists(input);

      if (exists) {
        setEmailValidMessage("Email is already connected to an account");
        return setEmailVerifying(false);
      }
      setEmailValidMessage("");
      return setEmailVerifying(false);
    } catch (error) {
      console.error("Email validation failed: " + error);
      setEmailValidMessage("Unable to verify email");
      return setEmailVerifying(false);
    }
  };

  const onBlurUsername = async (e: FormEvent<HTMLInputElement>) => {
    const input: string = e.currentTarget.value;

    if (input.length === 0) {
      setUsernameValidMessage("Username is required");
      setUsernameVerifying(false);
    }

    if (!authService.validateUsername(input)) {
      setUsernameValidMessage(
        "Username must be at least 6 characters without any special characters"
      );
      setUsernameVerifying(false);
    }
    try {
      const exists = await authService.usernameExists(input);

      if (exists) {
        setUsernameValidMessage("Username is already taken");
        setUsernameVerifying(false);
      }

      setUsernameValidMessage("");
      setUsernameVerifying(false);
    } catch (error) {
      console.error("Unable to validate username: " + error);
      setUsernameValidMessage("Unable to verify username");
      setUsernameVerifying(false);
    }
  };

  const onInputPassword = (e: FormEvent<HTMLInputElement>) => {
    const valid = authService.validatePassword(e.currentTarget.value)
      ? ""
      : "Password must be at least 8 characters, with 1 digit and special character";
    setPasswordValidMessage(valid);
  };

  const onBlurPassword = (e: FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;

    if (input.length === 0) {
      setPasswordValidMessage("Password is required");
      return setPasswordVerifying(false);
    }

    if (!authService.validatePassword(input)) {
      setPasswordValidMessage(
        "Password must be at least 8 characters with 1 digit and 1 special character"
      );
      return setPasswordVerifying(false);
    }

    setPasswordValidMessage("");
    return setPasswordVerifying(false);
  };

  const welcomeModal = () => {
    openModal({
      title: "Welcome to Dailyst!",
      content: (
        <p className="text-center px-2 my-8 text-text-900">
          Thanks for signing up! You can now use Dailyst and its features!
        </p>
      ),
    });
  };

  const signUpViaEmailAndPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    authService
      .signUpViaEmailAndPassword(email, username, password)
      .then(() => {
        navigate("/home");
        welcomeModal();
      })
      .catch(() => {
        throw new Error("Unable to create user");
      });
  };

  const signUpViaGoogle = async () => {
    authService.signUpViaGoogle().then(() => {
      navigate("/home");
      welcomeModal();
    });
  };

  return (
    <div className="page p-0 flex-row">
      {window.innerWidth >= 368 && <div className="flex-[43%]"></div>}
      <div className="flex flex-[100%] flex-col justify-around p-5 md:px-50 checkered-bg">
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
              autocomplete="email"
              label="Email"
              action={{
                onBlur: async (e) => await onBlurEmail(e),
                onFocus: () => setEmailInteracted(true),
              }}
              validity={{
                isValid: emailValid,
                verifying: emailVerifying,
                errorMessage: emailValidMessage,
              }}
            />
            <Input
              id="signup-username"
              name="username"
              type="text"
              autocomplete="name"
              label="Username"
              action={{
                onBlur: async (e) => await onBlurUsername(e),
                onFocus: () => setUsernameInteracted(true),
              }}
              validity={{
                isValid: usernameValid,
                verifying: usernameVerifying,
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
                verifying: passwordVerifying,
                errorMessage: passwordValidMessage,
              }}
              visible={passwordVisible}
            />

            {emailValid && usernameValid && passwordValid ? (
              <button
                className="p-2 border-2 rounded-md mt-4 cursor-pointer bg-primary-200 hover:bg-primary-300 duration-200"
                type="submit"
                title="Create Account"
              >
                Create
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
                Create
              </button>
            )}
          </form>

          <div className="flex flex-col items-center mt-4">
            <p className="mb-4">or join using</p>

            <div className="flex flex-col w-full gap-2">
              <button
                className="flex justify-center items-center gap-2 p-2 border-2 rounded-md cursor-pointer bg-background-50 hover:bg-background-100 duration-200"
                title="Joing with Google"
                onClick={async () => signUpViaGoogle()}
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
                title="Join as Guest"
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

        <Link to="/login" className="group text-center">
          <span>
            Already have an account?{" "}
            <span className="text-accent-300 group-hover:text-accent-500 selection:text-accent-500">
              Login
            </span>
          </span>
        </Link>
      </div>
      {window.innerWidth >= 368 && <div className="flex-[43%]"></div>}
    </div>
  );
};
