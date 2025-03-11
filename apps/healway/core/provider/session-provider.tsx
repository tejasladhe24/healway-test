"use client";

import { User } from "firebase/auth";
import {
  useContext,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { auth } from "../lib/firebase-utils";

interface ISessionContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const SessionContext = createContext<ISessionContext>({
  user: null,
  setUser: () => {},
});

export const useAuth = () => useContext<ISessionContext>(SessionContext);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [_user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        window.location.href = "/auth";
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ user: _user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
};
