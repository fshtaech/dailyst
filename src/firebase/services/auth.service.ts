import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { auth } from "../firebase.config";
import { InvalidAuthError } from "../exceptions/InvalidAuthError";
import { authType, type AuthType } from "../types/AuthType";
import { equalTo, get, orderByChild, query } from "firebase/database";
import { dbRef } from "../refs";
import { userService } from "./user.service";
import { FirebaseError } from "firebase/app";

export const authService = {
  getAuthUser: (): User | null => {
    return auth.currentUser;
  },

  getUserAuthType: (): AuthType => {
    const user: User | null = authService.getAuthUser();

    return user
      ? user.isAnonymous
        ? authType.ANONYMOUS
        : user.providerId == "google.com"
        ? authType.GOOGLE
        : authType.CREDENTIALS
      : authType.NONE;
  },

  validatePassword: (password: string): boolean => {
    return RegExp(/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/).test(
      password
    );
  },

  validateEmail: (email: string): boolean => {
    return RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(
      email
    );
  },

  validateUsername: (username: string): boolean => {
    return RegExp(/^[a-zA-Z0-9_.-]{6,15}$/).test(username);
  },

  emailExists: async (email: string): Promise<boolean> => {
    const emails = await get(
      query(dbRef.users(), ...[orderByChild("email"), equalTo(email)])
    );

    return emails.val() ? true : false;
  },

  usernameExists: async (username: string): Promise<boolean> => {
    const users = await get(
      query(dbRef.users(), ...[orderByChild("username"), equalTo(username)])
    );

    return users.val() ? true : false;
  },

  signInViaEmailAndPassword: async (
    identifier: string,
    password: string
  ): Promise<void> => {
    let email: string = identifier;

    const user = await userService.getUserByUsername(identifier);

    if (user) {
      email = user.email;
    }

    return signInWithEmailAndPassword(auth, email, password)
      .then(() => {})
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            throw new InvalidAuthError(
              error.code,
              `Email is invalid: ${email}`
            );
          case "auth/user-not-found":
            throw new InvalidAuthError(
              error.code,
              `User not found with Email: ${email}`
            );
          case "auth/user-disabled":
            throw new InvalidAuthError(
              error.code,
              `User is disabled with Email: ${email}`
            );
          case "auth/wrong-password":
            throw new InvalidAuthError(error.code, `Password is invalid`);
          default:
            throw new FirebaseError(error.code, error.message);
        }
      });
  },

  signUpViaEmailAndPassword: async (
    email: string,
    user: string,
    password: string
  ): Promise<void> => {
    createUserWithEmailAndPassword(auth, email, password).then((authUser) => {
      userService.createUser({
        id: authUser.user.uid,
        username: user,
        email: email,
        createdAt: new Date().toISOString(),
      });
    });
  },

  logoutUser: (): void => {
    auth.signOut();
  },
};
