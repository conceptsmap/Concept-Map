"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/web/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "ADMIN" }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login failed");
      const token = data?.data?.token;
      if (token) {
        localStorage.setItem("auth_token", token);
      }
      setSuccess("Login successful!");
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
      {/* LEFT: LOGIN FORM */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 min-h-[50vh]">
        <div className="w-130  rounded-xl bg-white p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Get Started Now</h1>
            <p className="text-sm text-gray-500">
              Welcome to Concept Map – Buy, Sell & Discover Scripts
            </p>
          </div>

          {/* Social Login (Dummy Buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="outline" className="w-full flex items-center gap-2 font-semibold">
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={18}
                height={18}
                unoptimized
                priority
              />
              Login with Google
            </Button>

            <Button variant="outline" className="w-full flex items-center gap-2 font-semibold">
              <Image
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                alt="Facebook"
                width={18}
                height={18}
                unoptimized
                priority
              />
              Login with Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="relative text-center">
            <span className="px-3 text-sm text-gray-400 bg-white relative z-10">
              or
            </span>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
          </div>

          {/* Email / Password Login */}

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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="text-sm text-green-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
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

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="#"
              className="text-green-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: IMAGE / PROMO SECTION */}
      <div className="relative hidden lg:flex flex-1 min-h-dvh max-h-dvh overflow-hidden">
        <Image
          src="/login-conceptmap.jpg"
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
