import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  type AuthError,
  type User,
} from "firebase/auth";
import { auth, gAuth } from "../firebase.config";
import { authType, type AuthType } from "../types/AuthType";
import { equalTo, get, orderByChild, query } from "firebase/database";
import { dbRef } from "../firebase.refs";
import { userService } from "./user.service";

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
    let email: string = "";

    try {
      const user = await userService.getUserByUsername(identifier);
      if (user) {
        email = user.email;
      }
    } catch {
      email = identifier;
    } finally {
      console.log(email);
      signInWithEmailAndPassword(auth, email, password).catch((error) => {
        throw error;
      });
    }
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

  signUpViaGoogle: async (): Promise<void> => {
    signInWithPopup(auth, gAuth).catch((error: AuthError) => {
      console.log(error);
      throw error;
    });
  },

  logoutUser: (): void => {
    auth.signOut();
  },
};
