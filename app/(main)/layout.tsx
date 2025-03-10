import { SessionProvider } from "@/core/provider/session-provider";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
