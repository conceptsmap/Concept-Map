"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import google from "@/assets/icons/google.png";
import facebook from "@/assets/icons/facebook.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");

      const token = data?.data?.token;
      const userRole = data?.data?._doc?.role || data?.data?.role;

      if (token) {
        localStorage.setItem("auth_token", token);
      }
      if (userRole) {
        localStorage.setItem("user_role", userRole);
      }

      setSuccess("Login successful!");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col lg:flex-row bg-white">
      <div className="flex flex-1 items-center justify-center px-4 py-10 min-h-[50vh]">
        <div className="w-130 rounded-xl bg-white p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Get Started Now</h1>
            <p className="text-sm text-gray-500">
              Welcome to Concept Map – Buy, Sell & Discover Scripts
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="w-full flex items-center gap-2 font-semibold">
              <Image src={google} alt="Google" width={18} height={18} unoptimized priority />
              Login with Google
            </Button>

            <Button variant="outline" className="w-full flex items-center gap-2 font-semibold">
              <Image src={facebook} alt="Facebook" width={18} height={18} unoptimized priority />
              Login with Facebook
            </Button>
          </div>

          <div className="relative text-center">
            <span className="px-3 text-sm text-gray-400 bg-white relative z-10">
              or
            </span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-green-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[36px] text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-green-600 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:flex flex-1 min-h-dvh max-h-dvh overflow-hidden">
        <Image
          src="/login.png"
          alt="Login Visual"
          fill
          className="object-cover"
          priority
          sizes="(min-width: 1024px) 50vw, 0vw"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}