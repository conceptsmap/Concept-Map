"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Users, Clock, Tag, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Opportunity {
    _id: string;
    title: string;
    description: string;
    budget: number;
    required_type: string | null;
    status: string;
    pitch_count: number;
    createdAt: string;
}

const SCRIPT_TYPE_LABELS: Record<string, string> = {
    SCRIPT: "Script",
    STORY_BOARD: "Storyboard",
    SYNOPSIS: "Synopsis",
};

export default function MyOpportunitiesPage() {
    const router = useRouter();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMy = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                if (!token) { router.push("/login"); return; }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/opportunity/my`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || "Failed to fetch");
                setOpportunities(data?.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error loading");
            } finally {
                setLoading(false);
            }
        };
        fetchMy();
    }, [router]);

    return (
        <div className="space-y-5">

            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Opportunities</h1>
                    <p className="text-sm text-gray-500">Opportunities you have posted.</p>
                </div>
                <Button className=" bg-[#013913] px-8 hover:bg-[#013913]/80" onClick={() => router.push(" /opportunities/create")}>Post New</Button>
            </div>

            {
                loading ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                        Loading...
                    </div>
                ) : error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                ) : opportunities.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center space-y-2">
                        <Briefcase className="h-8 w-8 text-gray-300 mx-auto" />
                        <p className="text-sm text-gray-500">You haven&apos;t posted any opportunities yet.</p>
                        <Button size="sm" onClick={() => router.push("/opportunities/create")}>
                            Post your first opportunity
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {opportunities.map((opp) => (
                            <Link
                                key={opp._id}
                                href={`/opportunities/${opp._id}`}
                                className="block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-base font-semibold text-gray-900">{opp.title}</h3>
                                            <span
                                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${opp.status === "OPEN"
                                                    ? "bg-green-50 text-green-700 border border-green-200"
                                                    : "bg-gray-100 text-gray-500 border border-gray-200"
                                                    }`}
                                            >
                                                {opp.status === "OPEN" ? (
                                                    <span className="flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" /> Open
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        <XCircle className="h-3 w-3" /> Closed
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 line-clamp-2">{opp.description}</p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-lg font-bold text-gray-900">₹{opp.budget.toLocaleString()}</p>
                                        {opp.required_type && (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5 mt-1">
                                                <Tag className="h-3 w-3" />
                                                {SCRIPT_TYPE_LABELS[opp.required_type] ?? opp.required_type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Users className="h-3.5 w-3.5" />
                                        {opp.pitch_count} / 25 pitches
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {new Date(opp.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )
            }
        </div >
    );
}
