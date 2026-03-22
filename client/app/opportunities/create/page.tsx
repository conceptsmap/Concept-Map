"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const SCRIPT_TYPES = [
    { value: "SCRIPT", label: "Script" },
    { value: "STORY_BOARD", label: "Storyboard" },
    { value: "SYNOPSIS", label: "Synopsis" },
];

export default function CreateOpportunityPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        title: "",
        description: "",
        budget: "",
        required_type: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.title.trim()) return setError("Title is required.");
        if (!form.description.trim()) return setError("Description is required.");
        if (!form.budget || isNaN(Number(form.budget)) || Number(form.budget) <= 0)
            return setError("Please enter a valid budget.");

        setSubmitting(true);
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                router.push("/login");
                return;
            }

            const body: Record<string, unknown> = {
                title: form.title.trim(),
                description: form.description.trim(),
                budget: Number(form.budget),
            };
            if (form.required_type) {
                body.required_type = form.required_type;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/opportunity`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Failed to create opportunity");

            router.push(`/opportunities/${data.data._id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl space-y-6">
            {/* Back */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </button>

            {/* Title */}
            <div className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-gray-700" />
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Post an Opportunity</h1>
                    <p className="text-sm text-gray-500">
                        Describe what you need — sellers will pitch their work to you.
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Title */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Need a 30-second TVC script for FMCG brand"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Describe what you need, tone, format, audience, etc."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                    />
                </div>

                {/* Budget */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                        Budget (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min={1}
                        placeholder="e.g. 10000"
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                </div>

                {/* Required type (optional) */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">
                        Preferred content type{" "}
                        <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, required_type: "" })}
                            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${!form.required_type
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                                }`}
                        >
                            Any
                        </button>
                        {SCRIPT_TYPES.map((st) => (
                            <button
                                key={st.value}
                                type="button"
                                onClick={() => setForm({ ...form, required_type: st.value })}
                                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${form.required_type === st.value
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                                    }`}
                            >
                                {st.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? "Posting..." : "Post Opportunity"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
