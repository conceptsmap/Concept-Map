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
            username?: string;
            email?: string;
        };
    };
}

const PurchasesPage = () => {
    const [payments, setPayments] = useState<BuyerPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data?.message || "Failed to fetch purchases");
                }

                setPayments(data?.data || []);
            } catch (fetchError) {
                setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch purchases");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    return (
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
                                        Purchased from: {payment.script_id?.userId?.username || payment.script_id?.userId?.email || "Unknown Seller"}
                                    </p>
                                    <p className="text-xs text-gray-500">Purchased on: {new Date(payment.createdAt).toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">Method: {payment.payment_method}</p>
                                    <p className="text-xs text-gray-500">Transaction: {payment.transaction_id}</p>
                                </div>

                                <div className="text-right space-y-2">
                                    <p className="text-sm font-semibold text-green-600">₹{Number(payment.price || 0).toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">{payment.payment_status}</p>
                                    {payment.script_id?._id && (
                                        <Link
                                            href={`/dashboard/${payment.script_id._id}?locked=false`}
                                            className="inline-flex items-center rounded-md border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                                        >
                                            See Details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PurchasesPage;
