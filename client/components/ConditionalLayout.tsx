"use client";
import { usePathname } from "next/navigation";
import Layout from "@/layout/components/Layout";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noLayout = pathname === "/" || pathname.startsWith("/login");
  return noLayout ? <>{children}</> : <Layout>{children}</Layout>;
}