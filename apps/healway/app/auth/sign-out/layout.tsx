import { SessionProvider } from "@/core/provider/session-provider";

export default function SignOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
