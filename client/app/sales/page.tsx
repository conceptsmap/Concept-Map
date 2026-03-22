"use client";

import React, { useEffect, useMemo, useState } from "react";

interface SellerPayment {
    _id: string;
    price: number;
    payment_method: string;
    payment_status: string;
    transaction_id: string;
    createdAt: string;
    script_id?: {
        _id?: string;
        main_title?: string;
    };
    user_id?: {
        username?: string;
        email?: string;
    };
}

export default function SalesPage() {
    const [payments, setPayments] = useState<SellerPayment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const role = localStorage.getItem("user_role");
        setUserRole(role);

        const fetchSales = async () => {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                setError("Please log in to view sales details.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/script/payments/seller`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data?.message || "Failed to fetch sales data");
                }

                setPayments(data?.data || []);
            } catch (fetchError) {
                setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch sales data");
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    const totalRevenue = useMemo(
        () => payments.reduce((sum, payment) => sum + Number(payment.price || 0), 0),
        [payments],
    );

    const scriptsSoldCount = useMemo(() => {
        const scriptIds = new Set(
            payments
                .map((payment) => payment.script_id?._id)
                .filter((scriptId): scriptId is string => Boolean(scriptId)),
        );
        return scriptIds.size;
    }, [payments]);

    const completedPaymentsCount = useMemo(
        () => payments.filter((payment) => payment.payment_status === "COMPLETED").length,
        [payments],
    );

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Sales Details</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Number of scripts purchased from you and complete payment details.
                </p>
            </div>

            {userRole && userRole !== "CREATOR" && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    This section is intended for script creators. If you have no published scripts, sales will remain zero.
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs text-gray-500">Scripts Sold</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{scriptsSoldCount}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs text-gray-500">Completed Payments</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{completedPaymentsCount}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-xs text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#013913] mt-1">₹{totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {loading ? (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                    Loading sales data...
                </div>
            ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            ) : payments.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
                    No sales found yet.
                </div>
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Script</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Buyer</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Amount</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Method</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Transaction</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment._id} className="border-t border-gray-100">
                                        <td className="px-4 py-3 text-gray-900 font-medium">
                                            {payment.script_id?.main_title || "Untitled Script"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {payment.user_id?.username || payment.user_id?.email || "Unknown Buyer"}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900 font-semibold">
                                            ₹{Number(payment.price || 0).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{payment.payment_method}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${payment.payment_status === "COMPLETED"
                                                    ? "bg-green-100 text-green-700"
                                                    : payment.payment_status === "FAILED"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {payment.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 max-w-40 truncate">{payment.transaction_id}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
