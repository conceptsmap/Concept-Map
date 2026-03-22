"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Briefcase, Users, Clock, Tag } from "lucide-react";
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
    buyer_id: {
        _id: string;
        username: string;
        email: string;
    };
}

const SCRIPT_TYPE_LABELS: Record<string, string> = {
    SCRIPT: "Script",
    STORY_BOARD: "Storyboard",
    SYNOPSIS: "Synopsis",
};

function OpportunityCard({ opp }: { opp: Opportunity }) {
    const spotsLeft = 25 - opp.pitch_count;
    const isFull = spotsLeft <= 0;

    return (
        <Link
            href={`/opportunities/${opp._id}`}
            className="block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
        >
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{opp.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{opp.description}</p>
                </div>
                <div className="shrink-0 text-right space-y-1">
                    <p className="text-lg font-bold text-gray-900">₹{opp.budget.toLocaleString()}</p>
                    {opp.required_type && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
                            <Tag className="h-3 w-3" />
                            {SCRIPT_TYPE_LABELS[opp.required_type] ?? opp.required_type}
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {isFull ? (
                        <span className="text-red-500 font-medium">Full (25/25)</span>
                    ) : (
                        <span>
                            {opp.pitch_count} / 25 pitches
                            <span className="ml-1 text-green-600 font-medium">({spotsLeft} left)</span>
                        </span>
                    )}
                </span>
                <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {opp.buyer_id?.username ?? "Buyer"}
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(opp.createdAt).toLocaleDateString()}
                </span>
            </div>
        </Link>
    );
}

export default function OpportunitiesPage() {
    const router = useRouter();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const currentRole = localStorage.getItem("user_role");
        setUserRole(currentRole);

        const fetchOpportunities = async () => {
            try {
                const token = localStorage.getItem("auth_token");
                const isBuyer = currentRole === "BUYER";

                if (isBuyer && !token) {
                    throw new Error("Please log in to view your opportunities");
                }

                const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
                const endpoint = isBuyer
                    ? `${process.env.NEXT_PUBLIC_API_URL}/web/opportunity/my`
                    : `${process.env.NEXT_PUBLIC_API_URL}/web/opportunity?limit=50`;

                const res = await fetch(
                    endpoint,
                    { headers },
                );
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || "Failed to fetch opportunities");
                setOpportunities(data?.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load opportunities");
            } finally {
                setLoading(false);
            }
        };

        fetchOpportunities();
    }, []);

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Opportunities</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Browse buyer requirements and pitch your work — up to 25 pitches per opportunity.
                    </p>
                </div>
                <div className="flex gap-2">
                    {userRole === "BUYER" && (
                        <Button
                            onClick={() => router.push("/opportunities/create")}
                            className="flex items-center gap-1.5  bg-[#013913] px-8 hover:bg-[#013913]/80"
                        >
                            <Plus className="h-4 w-4" />
                            Post Opportunity
                        </Button>
                    )}
                    {(userRole === "BUYER") && (
                        <Button
                            variant="outline"
                            onClick={() => router.push("/opportunities/my")}
                        >
                            {userRole === "BUYER" ? "My Opportunities" : "My Pitches"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                    Loading opportunities...
                </div>
            ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : opportunities.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center space-y-2">
                    <Briefcase className="h-8 w-8 text-gray-300 mx-auto" />
                    <p className="text-sm text-gray-500">No open opportunities yet.</p>
                    {userRole === "BUYER" && (
                        <Button size="sm" onClick={() => router.push("/opportunities/create")}>
                            Post the first one
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {opportunities.map((opp) => (
                        <OpportunityCard key={opp._id} opp={opp} />
                    ))}
                </div>
            )}
        </div>
    );
}
