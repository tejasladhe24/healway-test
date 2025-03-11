import Link from "next/link";
import { geistMono } from "../fonts";
import { cn } from "../lib/utils";
import { useSidebar } from "./ui/sidebar";

export const Logo = ({ className }: { className?: string }) => {
  const { open } = useSidebar();
  return (
    <Link
      href={"/"}
      className={cn(geistMono.className, "uppercase text-xl", className)}
    >
      {open && "Healway"}
      {!open && <span className="font-bold">H</span>}
    </Link>
  );
};
