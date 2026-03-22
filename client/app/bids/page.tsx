"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface BidUser {
    _id?: string;
    username?: string;
    email?: string;
    profile_url?: string;
}

interface BidScript {
    _id?: string;
    main_title?: string;
    type?: string[];
    userId?: BidUser;
    script?: {
        sale_type?: "FIXED" | "BIDDABLE";
        minimum_bid?: number;
    };
    synopsis?: {
        sale_type?: "FIXED" | "BIDDABLE";
        minimum_bid?: number;
    };
    story_borad?: {
        sale_type?: "FIXED" | "BIDDABLE";
        minimum_bid?: number;
    };
}

interface BidItem {
    _id: string;
    amount: number;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    createdAt?: string;
    buyer_id?: BidUser;
    script_id?: BidScript;
}

interface BuyerPayment {
    _id: string;
    price: number;
    payment_method: string;
    payment_status: string;
    transaction_id: string;
    reason?: string;
    createdAt?: string;
    script_id?: {
        _id?: string;
    };
}

export default function BidsPage() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [receivedBids, setReceivedBids] = useState<BidItem[]>([]);
    const [placedBids, setPlacedBids] = useState<BidItem[]>([]);
    const [paymentsByScriptId, setPaymentsByScriptId] = useState<Record<string, BuyerPayment>>({});
    const [activeTab, setActiveTab] = useState<"received" | "placed">("received");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

    const loadBids = async () => {
        setError("");
        setLoading(true);

        const token = localStorage.getItem("auth_token");
        if (!token) {
            setError("Please log in to view bids.");
            setLoading(false);
            return;
        }

        try {
            const [receivedRes, placedRes, buyerPaymentsRes] = await Promise.all([
                fetch(`${apiUrl}/web/script/bids/received`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${apiUrl}/web/script/bids/placed`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${apiUrl}/web/script/payments/buyer`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const receivedData = await receivedRes.json();
            const placedData = await placedRes.json();
            const buyerPaymentsData = await buyerPaymentsRes.json();

            if (receivedRes.ok) {
                setReceivedBids(receivedData?.data || []);
            }

            if (placedRes.ok) {
                setPlacedBids(placedData?.data || []);
            }

            if (buyerPaymentsRes.ok) {
                const paymentMap: Record<string, BuyerPayment> = {};
                const payments: BuyerPayment[] = buyerPaymentsData?.data || [];

                payments.forEach((payment) => {
                    const scriptId = payment?.script_id?._id;
                    // Keep the latest bid-purchase payment per script for quick lookup in bid cards.
                    if (scriptId && payment?.reason === "Bid purchase") {
                        if (!paymentMap[scriptId]) {
                            paymentMap[scriptId] = payment;
                        }
                    }
                });

                setPaymentsByScriptId(paymentMap);
            }

            if (!receivedRes.ok && !placedRes.ok) {
                throw new Error(receivedData?.message || placedData?.message || "Failed to fetch bids");
            }
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Failed to fetch bids");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userRole = localStorage.getItem("user_role");
        setRole(userRole);
        setActiveTab(userRole === "CREATOR" ? "received" : "placed");
        loadBids();
    }, []);

    const handleAccept = async (bidId: string) => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        try {
            const res = await fetch(`${apiUrl}/web/script/bids/${bidId}/accept`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || "Failed to accept bid");
            }

            await loadBids();
        } catch (actionError) {
            setError(actionError instanceof Error ? actionError.message : "Failed to accept bid");
        }
    };

    const handleDelete = async (bidId: string) => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        try {
            const res = await fetch(`${apiUrl}/web/script/bids/${bidId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.message || "Failed to delete bid");
            }

            await loadBids();
        } catch (actionError) {
            setError(actionError instanceof Error ? actionError.message : "Failed to delete bid");
        }
    };

    const visibleBids = useMemo(() => {
        return activeTab === "received" ? receivedBids : placedBids;
    }, [activeTab, placedBids, receivedBids]);

    const canShowReceived = role === "CREATOR";

    const getMinimumBid = (script: BidScript | undefined) => {
        if (!script) return 0;
        const postType = script.type?.[0];
        if (postType === "SCRIPT") return script.script?.minimum_bid || 0;
        if (postType === "SYNOPSIS") return script.synopsis?.minimum_bid || 0;
        if (postType === "STORY_BOARD") return script.story_borad?.minimum_bid || 0;
        return 0;
    };

    return (
        <div className="space-y-2">
            {/* <div>
                <h1 className="text-2xl font-bold text-gray-900">Bids</h1>
                <p className="text-sm text-gray-500 mt-1">Manage bids on your scripts and track your offers.</p>
            </div> */}

            <div className="flex items-center gap-2">
                {canShowReceived && (
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "received" ? "bg-[#013913] text-white" : "bg-white border text-gray-700"
                            }`}
                        onClick={() => setActiveTab("received")}
                    >
                        Received Bids
                    </button>
                )}

                <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "placed" ? "bg-[#013913] text-white" : "bg-white border text-gray-700"
                        }`}
                    onClick={() => setActiveTab("placed")}
                >
                    My Bids
                </button>
            </div>

            {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

            {loading ? (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading bids...</div>
            ) : visibleBids.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">No bids found.</div>
            ) : (
                <div className="space-y-3">
                    {visibleBids.map((bid) => {
                        const script = bid.script_id;
                        const buyer = bid.buyer_id;
                        const seller = script?.userId;
                        const payment = script?._id ? paymentsByScriptId[script._id] : undefined;

                        return (
                            <div key={bid._id} className="rounded-xl border border-gray-200 bg-white p-4">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="text-base font-semibold text-gray-900">{script?.main_title || "Untitled Script"}</p>
                                        <p className="text-sm text-gray-600 mt-1">Bid Amount: <span className="font-semibold text-gray-900">₹{Number(bid.amount || 0).toLocaleString()}</span></p>
                                        <p className="text-xs text-gray-500 mt-1">Minimum Bid: ₹{getMinimumBid(script).toLocaleString()}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs text-gray-500">Status:</p>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${bid.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                                bid.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {bid.status}
                                            </span>
                                        </div>
                                        {activeTab === "received" && (
                                            <p className="text-xs text-gray-500 mt-1">Buyer: {buyer?.username || buyer?.email || "Unknown"}</p>
                                        )}
                                        {activeTab === "placed" && (
                                            <p className="text-xs text-gray-500 mt-1">Seller: {seller?.username || seller?.email || "Unknown"}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {activeTab === "received" && bid.status === "PENDING" && (
                                            <>
                                                <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleAccept(bid._id)}>
                                                    Accept
                                                </Button>
                                                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => handleDelete(bid._id)}>
                                                    Delete
                                                </Button>
                                            </>
                                        )}

                                        {activeTab === "placed" && bid.status === "PENDING" && (
                                            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => handleDelete(bid._id)}>
                                                Delete
                                            </Button>
                                        )}

                                        {activeTab === "placed" && bid.status === "ACCEPTED" && !payment && (
                                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                                                window.location.href = `/checkout?bidId=${bid._id}`;
                                            }}>
                                                Go to Payment
                                            </Button>
                                        )}

                                        {activeTab === "placed" && bid.status === "ACCEPTED" && payment && (
                                            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-left">
                                                <p className="text-xs font-semibold text-green-700">Payment Completed</p>
                                                <p className="text-xs text-green-700 mt-0.5">
                                                    Amount: ₹{Number(payment.price || 0).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-green-700">
                                                    Method: {payment.payment_method}
                                                </p>
                                                <p className="text-[11px] text-green-600 truncate max-w-55">
                                                    Txn: {payment.transaction_id}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
