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

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("BUYER");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role,
                    is_verified: true
                }),
                credentials: "include",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Registration failed");

            setSuccess("Registration successful!");
            router.push("/login");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "Registration failed");
            } else {
                setError("Registration failed");
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
                        <h1 className="text-2xl font-semibold">Create Account</h1>
                        <p className="text-sm text-gray-500">
                            Welcome to Concept Map – Buy, Sell & Discover Scripts
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                required
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="At least 8 characters"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm password"
                                required
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Select Role</Label>
                            <select
                                id="role"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                disabled={loading}
                                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                                <option value="BUYER">BUYER</option>
                                <option value="CREATOR">CREATOR</option>
                            </select>
                        </div>

                        {error && <div className="text-red-600 text-sm">{error}</div>}
                        {success && <div className="text-green-600 text-sm">{success}</div>}

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-green-600 font-medium hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>

            <div className="relative hidden lg:flex flex-1 min-h-dvh max-h-dvh overflow-hidden">
                <Image
                    src="/login.png"
                    alt="Login Visual"
                    fill
                    className="object-fit"
                    priority
                    sizes="(min-width: 1024px) 50vw, 0vw"
                />e
                <div className="absolute inset-0 bg-black/20" />
            </div>
        </div>
    );
}