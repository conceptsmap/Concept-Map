"use client"

import React, { useState } from "react"
import Image from "next/image"

import visa from "@/assets/images/visa.svg"
import master from "@/assets/images/master.svg"
import tickOutlined from "@/assets/icons/tick_outlined.svg"
import tickFilled from "@/assets/icons/tick_fill.svg"
import SuccessScreen from "./SuccessScreen"
import LoadingScreen from "./LoadingScreen"
import arrow from "@/assets/icons/arrow_up.svg"
import tick_success from "@/assets/icons/tick_outline_success.svg"

type Status = "method" | "waiting" | "success"
type Section = "card" | "upi" | "bank"
type CardType = "visa" | "master" | "new" | null

const PAYMENT_METHOD_MAP = {
  card: "DEBIT_CARD",
  upi: "UPI",
  bank: "NETBANKING",
} as const

const PaymentMethod = ({
  price,
  postId,
  bidId,
}: {
  price: number
  postId?: string | null
  bidId?: string | null
}) => {
  const [status, setStatus] = useState<Status>("method")
  const [openSection, setOpenSection] = useState<Section>("card")
  const [selectedCard, setSelectedCard] = useState<CardType>("visa")
  const [upi, setUpi] = useState("")
  const [error, setError] = useState("")

  const normalizedBidId =
    bidId && bidId !== "null" && bidId !== "undefined" ? bidId : null
  const normalizedPostId =
    postId && postId !== "null" && postId !== "undefined" ? postId : null

  const isValidUpi = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(upi)

  const handlePay = async () => {
    setError("")

    const token = localStorage.getItem("auth_token")
    if (!token) {
      setError("Please log in first.")
      return
    }

    if (!normalizedBidId && !normalizedPostId) {
      setError("No item selected for payment.")
      return
    }

    if (openSection === "upi" && !isValidUpi) {
      setError("Please enter a valid UPI ID.")
      return
    }

    setStatus("waiting")

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/web/script/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_method: PAYMENT_METHOD_MAP[openSection],
          ...(normalizedBidId ? { bidId: normalizedBidId } : {}),
          ...(normalizedPostId ? { postId: normalizedPostId } : {}),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || "Payment failed")
      }

      setStatus("success")
    } catch (payError) {
      setStatus("method")
      setError(payError instanceof Error ? payError.message : "Payment failed")
    }
  }

  if (status === "waiting") {
    return (
      <LoadingScreen />
    )
  }

  if (status === "success") {
    return (
      <SuccessScreen />
    )
  }

  return (
    <div className="w-full max-w-99.75 min-h-130 rounded-3xl bg-white p-4 shadow-sm flex flex-col">

      <h2 className="mb-4 text-xl font-bold">Payment Method</h2>

      <SectionHeader
        title="Credit/Debit Card"
        open={openSection === "card"}
        onClick={() => setOpenSection("card")}
      />

      {openSection === "card" && (
        <div className="mb-4 space-y-3">

          <CardOption
            selected={selectedCard === "visa"}
            onClick={() => setSelectedCard("visa")}
            title="Visa **** 4321"
            subtitle="08/2028"
            logo={visa}
          />

          <CardOption
            selected={selectedCard === "master"}
            onClick={() => setSelectedCard("master")}
            title="Master **** 4321"
            subtitle="08/2028"
            logo={master}
          />

          <button
            onClick={() => setSelectedCard("new")}
            className={`w-full rounded-xl border p-4 text-left
              ${selectedCard === "new" ? "border-green-600" : ""}
            `}
          >
            <div className="flex items-center gap-3">
              <Image
                src={selectedCard === "new" ? tickFilled : tickOutlined}
                alt=""
                className="h-5 w-5"
              />
              <span className="font-medium">Add new card</span>
            </div>

            {selectedCard === "new" && (
              <div className="mt-4 space-y-3">
                <input
                  placeholder="6584 5655 6556"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="08/2028"
                    className="rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                  <input
                    placeholder="888"
                    className="rounded-lg border px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Image src={tickFilled} alt="" className="h-4 w-4" />
                  Save this card details
                </div>
              </div>
            )}
          </button>
        </div>
      )}

      <SectionHeader
        title="UPI / Net Banking"
        open={openSection === "upi"}
        onClick={() => setOpenSection("upi")}
      />

      {openSection === "upi" && (
        <div className="mb-4">
          <div className="relative">
            <input
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="yourname@upi"
              className="w-full rounded-xl border px-4 py-3 pr-10 text-sm outline-none"
            />

            {isValidUpi && (
              <Image
                src={tick_success}
                alt="Valid"
                className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2"
              />
            )}
          </div>
        </div>
      )}

      <SectionHeader
        title="Bank Transfer"
        open={openSection === "bank"}
        onClick={() => setOpenSection("bank")}
      />

      <div className="flex-1" />

      <button
        onClick={handlePay}
        className="rounded-xl bg-[#22C55E] py-4 text-white font-semibold cursor-pointer"
      >
        Pay ₹{price.toLocaleString()}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default PaymentMethod


const SectionHeader = ({
  title,
  open,
  onClick,
}: {
  title: string
  open: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="flex w-full items-center justify-between py-3"
  >
    <span className="font-medium">{title}</span>
    <span className="text-xl">{open ? <Image src={arrow} alt="" className="h-4 w-4" /> : <Image src={arrow} alt="" className="h-4 w-4 rotate-180" />}</span>
  </button>
)

const CardOption = ({
  selected,
  onClick,
  title,
  subtitle,
  logo,
}: {
  selected: boolean
  onClick: () => void
  title: string
  subtitle: string
  logo: string
}) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center justify-between rounded-xl border p-4
      ${selected ? "border-green-600" : ""}
    `}
  >
    <div className="flex items-start gap-3">
      <Image
        src={selected ? tickFilled : tickOutlined}
        alt=""
        className="h-5 w-5"
      />
      <div className="text-left">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
    <Image src={logo} alt="" className="h-6 w-auto" />
  </button>
)
