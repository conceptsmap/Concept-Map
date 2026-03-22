"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import profileImage from "@/assets/images/profile-image.png";

interface ReviewItem {
    _id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    reviewer_id?: {
        _id: string;
        username: string;
        profile_url?: string;
    };
    seller_id?: {
        _id: string;
        username: string;
        profile_url?: string;
    };
    script_id?: {
        _id: string;
        main_title?: string;
    };
}

const StarDisplay = ({ value, size = "sm" }: { value: number; size?: "sm" | "lg" }) => {
    const cls = size === "lg" ? "text-2xl" : "text-base";
    return (
        <span className={cls}>
            {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= value ? "text-yellow-400" : "text-gray-200"}>
                    ★
                </span>
            ))}
        </span>
    );
};

const RatingSummary = ({ reviews }: { reviews: ReviewItem[] }) => {
    if (!reviews.length) return null;
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
        pct: Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100),
    }));

    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 flex flex-col sm:flex-row gap-6 items-center">
            {/* Average */}
            <div className="text-center shrink-0">
                <p className="text-5xl font-bold text-gray-900">{avg.toFixed(1)}</p>
                <StarDisplay value={Math.round(avg)} size="lg" />
                <p className="text-xs text-gray-400 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
            </div>

            {/* Bar chart */}
            <div className="flex-1 w-full space-y-1.5">
                {distribution.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="w-4 text-right">{star}</span>
                        <span className="text-yellow-400 text-sm">★</span>
                        <div className="flex-1 rounded-full bg-gray-100 h-2 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-yellow-400 transition-all"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                        <span className="w-6 text-right">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReviewCard = ({
    review,
    mode,
}: {
    review: ReviewItem;
    mode: "received" | "written";
}) => {
    const person = mode === "received" ? review.reviewer_id : review.seller_id;
    const personLabel = mode === "received" ? "From" : "Seller";

    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 space-y-3">
            {/* Top row: avatar + name + date */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <img
                        src={person?.profile_url || profileImage.src}
                        alt={person?.username || "User"}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            {person?.username || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-400">
                            {personLabel} · {new Date(review.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>
                <div className="shrink-0">
                    <StarDisplay value={review.rating} />
                </div>
            </div>

            {/* Script name */}
            {review.script_id?.main_title && (
                <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#DBFFE7] px-2.5 py-1 text-xs font-medium text-[#013913]">
                        📄 {review.script_id.main_title}
                    </span>
                </div>
            )}

            {/* Comment */}
            {review.comment ? (
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            ) : (
                <p className="text-sm italic text-gray-400">No written comment.</p>
            )}
        </div>
    );
};

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [role, setRole] = useState<"CREATOR" | "BUYER" | null>(null);
    const [activeTab, setActiveTab] = useState<"received" | "written">("received");

    useEffect(() => {
        const userRole = localStorage.getItem("user_role") as "CREATOR" | "BUYER" | null;
        setRole(userRole);

        const defaultTab = userRole === "BUYER" ? "written" : "received";
        setActiveTab(defaultTab);
    }, []);

    useEffect(() => {
        if (!role) return;
        const fetchReviews = async () => {
            setLoading(true);
            setError("");
            const token = localStorage.getItem("auth_token");
            if (!token) {
                setError("Please log in.");
                setLoading(false);
                return;
            }
            try {
                const endpoint =
                    activeTab === "received"
                        ? `${process.env.NEXT_PUBLIC_API_URL}/web/review/received`
                        : `${process.env.NEXT_PUBLIC_API_URL}/web/review/my`;

                const res = await fetch(endpoint, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || "Failed to fetch reviews");
                setReviews(data?.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [role, activeTab]);

    const tabs = [
        ...(role === "CREATOR" || role === null
            ? [{ key: "received" as const, label: "Received" }]
            : []),
        { key: "written" as const, label: "Written" },
    ];

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
                <p className="text-sm text-gray-500 mt-1">
                    {activeTab === "received"
                        ? "Reviews buyers have left for your work."
                        : "Reviews you have written for sellers."}
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${activeTab === tab.key
                            ? "bg-white text-[#013913] shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Rating summary — only for received reviews */}
            {activeTab === "received" && !loading && reviews.length > 0 && (
                <RatingSummary reviews={reviews} />
            )}

            {/* Content */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 animate-pulse space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-200" />
                                <div className="space-y-1.5">
                                    <div className="h-3.5 w-28 bg-gray-200 rounded" />
                                    <div className="h-3 w-20 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="h-3 w-full bg-gray-200 rounded" />
                            <div className="h-3 w-4/5 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            ) : reviews.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center">
                    <p className="text-4xl mb-3">⭐</p>
                    <p className="text-sm font-medium text-gray-700">No reviews yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                        {activeTab === "received"
                            ? "Reviews from buyers will appear here once you make sales."
                            : "Reviews you write after purchases will appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} mode={activeTab} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReviewsPage;
