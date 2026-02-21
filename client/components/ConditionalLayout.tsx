"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Layout from "@/layout/components/Layout";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token && (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register"))) {
      router.replace("/dashboard");
    }

    if (!token && !(pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register"))) {
      router.replace("/login");
    }
  }, [pathname, router]);

  const noLayout = pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/register");

  return noLayout ? <>{children}</> : <Layout>{children}</Layout>;
}