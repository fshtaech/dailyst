import { useState, useEffect } from "react";
import { type UserType } from "../types/User";
import { auth } from "../firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { userService } from "../services/user.service";

export const useAuthUser = () => {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) setCurrentUser(await userService.getUserById(user.uid));
    });

    return () => unsub();
  }, []);

  if (currentUser !== null) {
    return currentUser;
  }

  throw new Error("There is no current user");
};
