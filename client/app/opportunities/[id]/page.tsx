"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Briefcase,
    Users,
    Clock,
    Tag,
    CheckCircle2,
    XCircle,
    Send,
    FileText,
    Image as ImageIcon,
    AlignLeft,
    ChevronDown,
} from "lucide-react";
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

interface Pitch {
    _id: string;
    pitch_type: string;
    message: string;
    status: string;
    createdAt: string;
    seller_id: {
        _id: string;
        username: string;
        email: string;
        profile_url?: string;
        jobRole?: string;
    };
    script_id?: {
        _id: string;
        main_title?: string;
        type?: string[];
        description?: string;
    };
}

interface UserScript {
    _id: string;
    main_title?: string;
    type?: string[];
}

// Decode JWT payload without a library (no signature verification needed client-side)
function decodeJwtUserId(token: string): string | null {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload?.id ?? null;
    } catch {
        return null;
    }
}

const SCRIPT_TYPE_LABELS: Record<string, string> = {
    SCRIPT: "Script",
    STORY_BOARD: "Storyboard",
    SYNOPSIS: "Synopsis",
};

const PITCH_TYPE_OPTIONS = [
    { value: "SCRIPT", label: "Script", icon: FileText },
    { value: "STORY_BOARD", label: "Storyboard", icon: ImageIcon },
    { value: "SYNOPSIS", label: "Synopsis", icon: AlignLeft },
];

const PITCH_STATUS_STYLES: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    ACCEPTED: "bg-green-50 text-green-700 border-green-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
};

function SellerAvatar({ name, profileUrl }: { name: string; profileUrl?: string }) {
    if (profileUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={profileUrl}
                alt={name}
                className="h-10 w-10 rounded-full object-cover shrink-0 border border-gray-200"
            />
        );
    }
    return (
        <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-gray-500 uppercase">
                {name?.charAt(0) || "S"}
            </span>
        </div>
    );
}

function PitchCard({ pitch }: { pitch: Pitch }) {
    const seller = pitch.seller_id;
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
            {/* Seller info + status badges */}
            <div className="flex items-start gap-3">
                <SellerAvatar name={seller?.username} profileUrl={seller?.profile_url} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-gray-900 leading-tight">
                                {seller?.username || "Seller"}
                            </p>
                            {seller?.jobRole && (
                                <p className="text-xs text-purple-700 font-medium">{seller.jobRole}</p>
                            )}
                            <p className="text-xs text-gray-500">{seller?.email}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                                {pitch.pitch_type === "SCRIPT" && <FileText className="h-3 w-3" />}
                                {pitch.pitch_type === "STORY_BOARD" && <ImageIcon className="h-3 w-3" />}
                                {pitch.pitch_type === "SYNOPSIS" && <AlignLeft className="h-3 w-3" />}
                                {SCRIPT_TYPE_LABELS[pitch.pitch_type] ?? pitch.pitch_type}
                            </span>
                            <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full border ${PITCH_STATUS_STYLES[pitch.status] ?? "bg-gray-50 text-gray-500 border-gray-200"
                                    }`}
                            >
                                {pitch.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attached script */}
            {pitch.script_id && (
                <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                            <FileText className="h-4 w-4 text-gray-500 shrink-0" />
                            {pitch.script_id.main_title || "Attached script"}
                        </div>
                        {pitch.script_id.type && pitch.script_id.type.length > 0 && (
                            <span className="text-xs text-gray-500">
                                {pitch.script_id.type.map((t) => SCRIPT_TYPE_LABELS[t] ?? t).join(", ")}
                            </span>
                        )}
                    </div>
                    {pitch.script_id.description && (
                        <p className="text-xs text-gray-500 line-clamp-2">{pitch.script_id.description}</p>
                    )}
                    <Link
                        href={`/dashboard/${pitch.script_id._id}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 underline"
                    >
                        View script →
                    </Link>
                </div>
            )}

            {/* Message */}
            {pitch.message && (
                <div className="bg-gray-50 rounded-lg px-4 py-3">
                    <p className="text-xs font-medium text-gray-400 mb-1">Message from seller</p>
                    <p className="text-sm text-gray-700 leading-relaxed">&quot;{pitch.message}&quot;</p>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-gray-100">
                <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(pitch.createdAt).toLocaleString()}
                </p>
            </div>
        </div>
    );
}

export default function OpportunityDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
    const [pitches, setPitches] = useState<Pitch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [hasPitched, setHasPitched] = useState(false);

    // Pitch form
    const [pitchType, setPitchType] = useState("SCRIPT");
    const [message, setMessage] = useState("");
    const [scriptId, setScriptId] = useState("");
    const [userScripts, setUserScripts] = useState<UserScript[]>([]);
    const [pitching, setPitching] = useState(false);
    const [pitchError, setPitchError] = useState("");
    const [pitchSuccess, setPitchSuccess] = useState(false);

    const [closing, setClosing] = useState(false);

    const isBuyerOwner =
        opportunity && userId && String(opportunity.buyer_id?._id) === userId;
    const isSeller = userRole === "CREATOR";

    const fetchPitches = useCallback(async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/web/opportunity/${id}/pitches`,
                { headers: { Authorization: `Bearer ${token}` } },
            );
            const data = await res.json();
            if (res.ok) setPitches(data?.data || []);
        } catch {
            // silently fail — pitches are secondary
        }
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        const role = localStorage.getItem("user_role");
        const storedUserId = token ? decodeJwtUserId(token) : null;
        setUserRole(role);
        setUserId(storedUserId);

        const fetchAll = async () => {
            try {
                const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

                // Load opportunity
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/web/opportunity/${id}`,
                    { headers },
                );
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || "Opportunity not found");
                setOpportunity(data?.data);

                // Check if seller already pitched
                if (token) {
                    const pitchedRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/web/opportunity/${id}/pitched`,
                        { headers },
                    );
                    const pitchedData = await pitchedRes.json();
                    if (pitchedRes.ok) setHasPitched(pitchedData?.data?.has_pitched ?? false);
                }

                // If buyer, load pitches
                if (role === "BUYER" && token) {
                    fetchPitches();
                }

                // If seller, load their scripts
                if (role === "CREATOR" && token) {
                    const scriptsRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/web/script/all/details`,
                        { headers: { Authorization: `Bearer ${token!}` } },
                    );
                    const scriptsData = await scriptsRes.json();
                    if (scriptsRes.ok) {
                        setUserScripts(
                            (scriptsData?.data || []).filter(
                                (s: UserScript) => s.main_title,
                            ),
                        );
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [id, fetchPitches]);

    const handlePitch = async (e: React.FormEvent) => {
        e.preventDefault();
        setPitchError("");
        if (!pitchType) return setPitchError("Select pitch type.");

        setPitching(true);
        try {
            const token = localStorage.getItem("auth_token");
            if (!token) { router.push("/login"); return; }

            const body: Record<string, unknown> = { pitch_type: pitchType, message };
            if (scriptId) body.script_id = scriptId;

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/web/opportunity/${id}/pitch`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                },
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Failed to submit pitch");

            setPitchSuccess(true);
            setHasPitched(true);
            setOpportunity((prev) =>
                prev ? { ...prev, pitch_count: prev.pitch_count + 1 } : prev,
            );
        } catch (err) {
            setPitchError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setPitching(false);
        }
    };

    const handleClose = async () => {
        setClosing(true);
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/web/opportunity/${id}/close`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token!}` },
                },
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Failed to close");
            setOpportunity((prev) => (prev ? { ...prev, status: "CLOSED" } : prev));
        } catch {
            // ignore
        } finally {
            setClosing(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Loading opportunity...
            </div>
        );
    }

    if (error || !opportunity) {
        return (
            <div className="space-y-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error || "Opportunity not found."}
                </div>
            </div>
        );
    }

    const spotsLeft = 25 - opportunity.pitch_count;
    const isClosed = opportunity.status === "CLOSED";

    return (
        <div className="space-y-6 ">
            {/* Back */}
            {/* <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Opportunities
            </button> */}

            {/* Opportunity card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl font-bold text-gray-900">{opportunity.title}</h1>
                            <span
                                className={`text-xs font-medium px-2 py-0.5 rounded-full border flex items-center gap-1 ${isClosed
                                    ? "bg-gray-100 text-gray-500 border-gray-200"
                                    : "bg-green-50 text-green-700 border-green-200"
                                    }`}
                            >
                                {isClosed ? (
                                    <>
                                        <XCircle className="h-3 w-3" /> Closed
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-3 w-3" /> Open
                                    </>
                                )}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">{opportunity.description}</p>
                    </div>
                    <div className="shrink-0 text-right space-y-1">
                        <p className="text-2xl font-bold text-gray-900">
                            ₹{opportunity.budget.toLocaleString()}
                        </p>
                        {opportunity.required_type && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
                                <Tag className="h-3 w-3" />
                                {SCRIPT_TYPE_LABELS[opportunity.required_type] ?? opportunity.required_type}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap border-t border-gray-100 pt-3">
                    <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        Posted by <strong className="text-gray-700 ml-1">{opportunity.buyer_id?.username}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {opportunity.pitch_count}/25 pitches
                        {!isClosed && (
                            <span className={`ml-1 font-medium ${spotsLeft <= 5 ? "text-red-500" : "text-green-600"}`}>
                                ({spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left)
                            </span>
                        )}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(opportunity.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Buyer controls */}
                {isBuyerOwner && !isClosed && (
                    <div className="border-t border-gray-100 pt-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClose}
                            disabled={closing}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            {closing ? "Closing..." : "Close Opportunity"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Pitch form — sellers only, opportunity must be open, not already pitched */}
            {isSeller && !isBuyerOwner && !isClosed && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
                    <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Submit Your Pitch
                    </h2>

                    {pitchSuccess ? (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            Pitch submitted successfully! The buyer will review your submission.
                        </div>
                    ) : hasPitched ? (
                        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                            You have already submitted a pitch for this opportunity.
                        </div>
                    ) : spotsLeft <= 0 ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            This opportunity has reached the maximum of 25 pitches and is no longer accepting new submissions.
                        </div>
                    ) : (
                        <form onSubmit={handlePitch} className="space-y-4">
                            {pitchError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {pitchError}
                                </div>
                            )}

                            {/* Pitch type */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">
                                    Pitch with <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {PITCH_TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setPitchType(value)}
                                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${pitchType === value
                                                ? "bg-gray-900 text-white border-gray-900"
                                                : "bg-white text-gray-600 border-gray-300 hover:border-gray-600"
                                                }`}
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Attach script (optional) */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">
                                    Attach one of your posts{" "}
                                    <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={scriptId}
                                        onChange={(e) => setScriptId(e.target.value)}
                                        className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 pr-8"
                                    >
                                        <option value="">— None —</option>
                                        {userScripts.map((s) => (
                                            <option key={s._id} value={s._id}>
                                                {s.main_title} ({(s.type ?? []).join(", ")})
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Message */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">
                                    Message{" "}
                                    <span className="text-gray-400 font-normal">(optional)</span>
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Briefly describe your pitch and why you're a great fit..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                />
                            </div>

                            <Button type="submit" disabled={pitching} className="w-full">
                                {pitching ? "Submitting..." : "Submit Pitch"}
                            </Button>
                        </form>
                    )}
                </div>
            )}

            {/* Pitches section — buyer owner only */}
            {isBuyerOwner && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Received Pitches ({pitches.length})
                        </h2>
                        <button
                            onClick={fetchPitches}
                            className="text-xs text-gray-500 hover:text-gray-800 underline"
                        >
                            Refresh
                        </button>
                    </div>

                    {pitches.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
                            No pitches yet. Share this opportunity page to attract sellers.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pitches.map((pitch) => (
                                <PitchCard key={pitch._id} pitch={pitch} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
