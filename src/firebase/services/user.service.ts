import { type UserType } from "../types/User";
import { dbRef } from "../refs";
import {
  DataSnapshot,
  equalTo,
  get,
  orderByChild,
  query,
  set,
} from "firebase/database";
import { NoUserError } from "../exceptions/NoUserError";
import { authService } from "./auth.service";
import { getFirstObject } from "../../lib/utils/get";

export const userService = {
  getUserById: async (id: string): Promise<UserType> => {
    return await get(dbRef.user(id)).then((snap) => {
      if (!snap) {
        throw new NoUserError(`No user was found with id ${id}`);
      }
      return snap.val();
    });
  },

  getUserByEmail: async (email: string): Promise<UserType> => {
    const snap = await get(
      query(dbRef.users(), ...[orderByChild("email"), equalTo(email)])
    );

    if (!snap) {
      throw new NoUserError(`No user was found with email ${email}`);
    }
    return getFirstObject(snap.val()).value as UserType;
  },

  getUserByUsername: async (username: string): Promise<UserType> => {
    const snap: DataSnapshot = await get(
      query(dbRef.users(), ...[orderByChild("username"), equalTo(username)])
    );

    if (!snap) {
      throw new NoUserError(`No user was found with username ${username}`);
    }

    return getFirstObject(snap.val()).value as UserType;
  },

  getCurrentUser: async (): Promise<UserType> => {
    const authUser = authService.getAuthUser();

    if (authUser) return userService.getUserById(authUser.uid);

    throw new NoUserError("No authenticated user was found");
  },

  createUser: async (
    user: Pick<UserType, "id" | "username" | "email" | "createdAt">
  ) => {
    await set(dbRef.user(user.id), user);
  },
};
