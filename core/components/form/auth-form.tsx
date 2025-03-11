"use client";

import { onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { auth, provider } from "@/core/lib/firebase-utils";
import { useEffect, useState } from "react";

export const AuthForm = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/recordings");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <Button onClick={handleLogin} className="gap-2">
        <FaGoogle className="size-4" />
        Sign In with Google
      </Button>
    </div>
  );
};
