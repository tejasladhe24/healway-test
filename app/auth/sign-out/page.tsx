"use client";

import { auth } from "@/core/lib/firebase-utils";
import { useAuth } from "@/core/provider/session-provider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOutPage() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (user) {
        await auth.signOut();
      } else {
        router.replace("/");
      }
    })();

    return () => {
      setUser(null);
    };
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex items-center gap-2">
        <Loader2 className="size-4 animate-spin" />
        Signing Out...
      </div>
    </div>
  );
}
