import { Sidebar } from "./components/Sidebar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Journals } from "./pages/Journals";
import { Todos } from "./pages/Todos";
import { Goals } from "./pages/Goals";
import { Login } from "./pages/Login";
import { Join } from "./pages/Join";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { UserType } from "./db/firebase/types/User";
import { auth } from "./db/firebase/firebase.config";
import { userService } from "./db/firebase/services/user.service";
import { AuthContext } from "./db/firebase/contexts/AuthContext";
import { ModalProvider } from "./lib/contexts/ModalProvider";

export const App = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        setCurrentUser(await userService.getUserById(user.uid));
      }
    });

    return () => unsub();
  }, [authUser]);

  return (
    <BrowserRouter>
      <ModalProvider>
        <AuthContext.Provider value={{ authUser, currentUser }}>
          <Sidebar />
          <Routes>
            <Route path="/home" element={<Home />} />
            /* Logged out-exclusive routes */
            <Route
              path="/login"
              element={currentUser ? <Navigate to="/home" /> : <Login />}
            />
            <Route
              path="/join"
              element={currentUser ? <Navigate to="/home" /> : <Join />}
            />
            /* Protected routes */
            <Route path="/join" element={<Join />} />
            <Route path="/journals" element={<Journals />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/goals" element={<Goals />} />
            /* Fallback route */
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </AuthContext.Provider>
      </ModalProvider>
    </BrowserRouter>
  );
};
