import { createContext, useContext } from "react";
import { type UserType } from "../types/User";
import type { User } from "firebase/auth";

interface AuthContextType {
  authUser: User | null;
  currentUser: UserType | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const user = useContext(AuthContext);

  if (user == null) {
    throw new Error("User was not found");
  }

  return user;
};
