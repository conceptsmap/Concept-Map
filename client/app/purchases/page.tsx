"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface BuyerPayment {
    _id: string;
    price: number;
    payment_method: string;
    payment_status: string;
    transaction_id: string;
    createdAt: string;
    script_id?: {
        _id?: string;
        main_title?: string;
        userId?: {
            _id?: string;
            username?: string;
            email?: string;
        };
    };
}

interface ReviewModalProps {
    payment: BuyerPayment;
    onClose: () => void;
    onSubmitted: (paymentId: string) => void;
}

const StarRating = ({
    value,
    onChange,
    readonly = false,
}: {
    value: number;
    onChange?: (v: number) => void;
    readonly?: boolean;
}) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => !readonly && setHover(star)}
                    onMouseLeave={() => !readonly && setHover(0)}
                    className={`text-2xl transition-transform ${readonly ? "cursor-default" : "hover:scale-110 cursor-pointer"}`}
                >
                    <span
                        className={
                            star <= (hover || value)
                                ? "text-yellow-400"
                                : "text-gray-300"
                        }
                    >
                        ★
                    </span>
                </button>
            ))}
        </div>
    );
};

const ReviewModal = ({ payment, onClose, onSubmitted }: ReviewModalProps) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const sellerName =
        payment.script_id?.userId?.username ||
        payment.script_id?.userId?.email ||
        "the seller";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a star rating.");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/web/review`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        seller_id: payment.script_id?.userId?._id,
                        script_id: payment.script_id?._id,
                        payment_id: payment._id,
                        rating,
                        comment: comment.trim() || undefined,
                    }),
                },
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Failed to submit review");
            onSubmitted(payment._id);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-linear-to-r from-[#013913] to-[#025a1e] px-6 py-5">
                    <h2 className="text-lg font-semibold text-white">
                        Review Your Purchase
                    </h2>
                    <p className="text-sm text-green-200 mt-0.5">
                        Share your experience with{" "}
                        <span className="font-medium text-white">{sellerName}</span>
                    </p>
                </div>

                {/* Script info */}
                <div className="px-6 pt-4 pb-2">
                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#DBFFE7] text-[#013913] text-lg font-bold">
                            📄
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-800">
                                {payment.script_id?.main_title || "Untitled Script"}
                            </p>
                            <p className="text-xs text-gray-500">Seller: {sellerName}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5 pt-4">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Overall Rating <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <StarRating value={rating} onChange={setRating} />
                            {rating > 0 && (
                                <span className="text-sm text-gray-500">
                                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review{" "}
                            <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={500}
                            rows={3}
                            placeholder="Tell others about the quality, communication, and overall experience…"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-[#013913] focus:outline-none focus:ring-2 focus:ring-[#013913]/10 resize-none"
                        />
                        <p className="text-right text-xs text-gray-400 mt-1">
                            {comment.length}/500
                        </p>
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">
                            {error}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 rounded-xl bg-[#013913] py-2.5 text-sm font-medium text-white hover:bg-[#025a1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting…" : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PurchasesPage = () => {
    const [payments, setPayments] = useState<BuyerPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviewedPayments, setReviewedPayments] = useState<Set<string>>(new Set());
    const [activeReviewPayment, setActiveReviewPayment] = useState<BuyerPayment | null>(null);

    useEffect(() => {
        const fetchPurchases = async () => {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                setError("Please log in to view purchases.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/script/payments/buyer`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || "Failed to fetch purchases");

                const fetchedPayments: BuyerPayment[] = data?.data || [];
                setPayments(fetchedPayments);

                // Check which payments already have reviews
                if (fetchedPayments.length > 0) {
                    const checks = await Promise.all(
                        fetchedPayments.map(async (p) => {
                            const r = await fetch(
                                `${process.env.NEXT_PUBLIC_API_URL}/web/review/payment/${p._id}`,
                                { headers: { Authorization: `Bearer ${token}` } },
                            );
                            const d = await r.json();
                            return d?.data ? p._id : null;
                        }),
                    );
                    const reviewed = new Set(checks.filter(Boolean) as string[]);
                    setReviewedPayments(reviewed);
                }
            } catch (fetchError) {
                setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch purchases");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    const handleReviewSubmitted = (paymentId: string) => {
        setReviewedPayments((prev) => new Set(prev).add(paymentId));
    };

    return (
        <>
            {activeReviewPayment && (
                <ReviewModal
                    payment={activeReviewPayment}
                    onClose={() => setActiveReviewPayment(null)}
                    onSubmitted={handleReviewSubmitted}
                />
            )}

            <div className="space-y-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Purchases</h1>
                    <p className="text-sm text-gray-500 mt-1">Purchased scripts, seller details, and transaction info.</p>
                </div>

                {loading ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading purchases...</div>
                ) : error ? (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
                ) : payments.length === 0 ? (
                    <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">No purchases yet.</div>
                ) : (
                    <div className="space-y-3">
                        {payments.map((payment) => (
                            <div key={payment._id} className="rounded-xl border border-gray-200 bg-white p-4">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="space-y-1">
                                        <p className="text-base font-semibold text-gray-900">{payment.script_id?.main_title || "Untitled"}</p>
                                        <p className="text-sm text-gray-600">
                                            Purchased from:{" "}
                                            {payment.script_id?.userId?.username ||
                                                payment.script_id?.userId?.email ||
                                                "Unknown Seller"}
                                        </p>
                                        <p className="text-xs text-gray-500">Purchased on: {new Date(payment.createdAt).toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">Method: {payment.payment_method}</p>
                                        <p className="text-xs text-gray-500">Transaction: {payment.transaction_id}</p>
                                    </div>

                                    <div className="text-right space-y-2">
                                        <p className="text-sm font-semibold text-green-600">
                                            ₹{Number(payment.price || 0).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500">{payment.payment_status}</p>

                                        <div className="flex flex-col items-end gap-2">
                                            {payment.script_id?._id && (
                                                <Link
                                                    href={`/dashboard/${payment.script_id._id}?locked=false`}
                                                    className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                                                >
                                                    See Details
                                                </Link>
                                            )}

                                            {reviewedPayments.has(payment._id) ? (
                                                <span className="inline-flex items-center gap-1 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700">
                                                    ★ Reviewed
                                                </span>
                                            ) : (
                                                payment.script_id?.userId?._id && (
                                                    <button
                                                        onClick={() => setActiveReviewPayment(payment)}
                                                        className="inline-flex items-center gap-1 rounded-md border border-[#013913]/20 bg-[#DBFFE7] px-3 py-1.5 text-xs font-medium text-[#013913] hover:bg-[#c3f7d0] transition-colors"
                                                    >
                                                        ★ Leave a Review
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default PurchasesPage;

