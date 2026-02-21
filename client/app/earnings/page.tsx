'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import sbi from '@/assets/images/sbi.svg'
import insightsIcon from '@/assets/icons/insights.svg'
import secure from '@/assets/icons/shield_check.svg'
import { Button } from '@/components/ui/button'

// ── mock data ────────────────────────────────────────────────────────────────
const earningsData = [
  { day: 'Sun 01', value: 2000 },
  { day: 'Mon 02', value: 8000 },
  { day: 'Tue 03', value: 45000 },
  { day: 'Wed 04', value: 20000 },
  { day: 'Thu 05', value: 15000 },
  { day: 'Fri 06', value: 70000 },
  { day: 'Sat 07', value: 95000 },
]

const postsData = [
  { month: 'Jan', sold: 1, posts: 2 },
  { month: 'Feb', sold: 2, posts: 3 },
  { month: 'Mar', sold: 3, posts: 4 },
  { month: 'Apr', sold: 4, posts: 3 },
  { month: 'May', sold: 1, posts: 2 },
]

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string }>
  label?: string
}

const EarningsTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null

  const value = payload[0].value as number

  return (
    <div className="bg-gray-900 text-white text-xs font-mono px-2.5 py-1.5 rounded-lg shadow-lg">
      ₹{value.toLocaleString()}
    </div>
  )
}

const PostsTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg space-y-0.5">
      <p className="font-semibold">{label}</p>

      {payload.map((entry: { name?: string; value?: number | string }) => (
        <p key={String(entry.name)}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}


interface BankCardProps {
  name: string
  last4: string
  isDefault?: boolean
}

const BankCard: React.FC<BankCardProps> = ({ name, last4, isDefault }) => (
  <div className="border border-gray-200 rounded-xl p-3.5">
    <div className="flex items-center gap-2.5 mb-3">
      <Image src={sbi} alt="State Bank of India" width={36} height={36} className="rounded-lg" />
      <div>
        <span className="text-[11px] text-gray-400 block">State Bank of India</span>
        <p className="text-[13px] font-semibold text-gray-900">
          {name} **** {last4}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {isDefault ? (
        <span className="text-[12px] text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
          ✓ Default
        </span>
      ) : (
        <button className="text-[12px] text-gray-500 border border-gray-200 rounded-full px-2.5 py-1 hover:border-green-500 hover:text-green-600 transition-colors">
          Set as Default
        </button>
      )}
      <button className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors">Edit</button>
      <button className="text-[12px] text-gray-500 hover:text-red-500 transition-colors">Delete</button>
    </div>
  </div>
)

const UpiCard: React.FC<{ upiId: string }> = ({ upiId }) => (
  <div className="border border-gray-200 rounded-xl p-3.5">
    <span className="text-[11px] text-gray-400 block mb-1">UPI ID</span>
    <p className="text-[14px] font-semibold text-gray-900 mb-3">{upiId}</p>
    <div className="flex items-center gap-3">
      <button className="text-[12px] text-gray-500 border border-gray-200 rounded-full px-2.5 py-1 hover:border-green-500 hover:text-green-600 transition-colors">
        Set as Default
      </button>
      <button className="text-[12px] text-gray-500 hover:text-gray-900 transition-colors">Edit</button>
      <button className="text-[12px] text-gray-500 hover:text-red-500 transition-colors">Delete</button>
    </div>
  </div>
)


const Earnings = () => {
  const [amount, setAmount] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('April')

  return (
    <div className="min-h-screen  py-1 flex justify-center">
      <div className="w-full flex flex-col gap-4">

        {/* ── Earnings Summary ── */}
        <div className="bg-white rounded-2xl p-3 border border-gray-100">
          <p className="text-xl font-bold text-gray-900 mb-4">Earnings Summary</p>

          <div className="grid grid-cols-3 gap-4 mb-5 max-sm:grid-cols-1">
  {/* Total Balance */}
  <div className="bg-[#013913] rounded-xl px-5 py-4 text-white flex flex-col justify-top min-h-[88px]">
    <p className=" opacity-80 mb-1">Total Balance</p>
    <p className="font-mono text-[24px] font-medium leading-none">
      ₹42,000
    </p>
  </div>

  {/* Pending Amount */}
  <div className="bg-gray-50 rounded-xl px-5 py-4 flex flex-col justify-top min-h-[88px] border border-gray-100">
    <p className=" text-[#777777] mb-1">Pending Amount</p>
    <p className="font-mono text-[24px] font-medium text-gray-900 leading-none">
      ₹6,000
    </p>
  </div>

  {/* Withdrawable Balance */}
  <div className="bg-gray-50 rounded-xl px-5 py-4 flex flex-col justify-top min-h-[88px] border border-gray-100">
    <p className=" text-[#777777] mb-1">Withdrawable Balance</p>
    <p className="font-mono text-[24px] font-medium text-gray-900 leading-none">
      ₹36,000
    </p>
    <p className="text-[11px] text-gray-400 mt-1">
      Last Payout 3rd March 2025
    </p>
  </div>
</div>

          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-green-500 transition-colors"
            />
            <button className="bg-[#1DBF73] hover:bg-[#24a041] active:scale-95 text-white font-semibold text-sm rounded-xl px-5 py-3 transition-all whitespace-nowrap cursor-pointer">
              Request Payout
            </button>
          </div>

        </div>
          <div className="flex gap-2.5  rounded-xl px-2">
            <span className="text-[15px] shrink-0 mt-0.5"><Image src={secure} alt="Secure" width={20} height={20} /></span>
            <p className="text-sm text-black leading-relaxed">
              Your payout details are securely encrypted. We do not store sensitive banking
              credentials. Ensure your account details are accurate before requesting a payout.
              If you notice any unauthorized activity, contact support immediately.
            </p>
          </div>

        {/* ── Saved Payment Methods ── */}
        <div className="bg-white rounded-2xl p-3 border border-gray-100">
          <p className="text-xl font-bold text-gray-900 mb-1">Saved Payment Methods</p>
          <p className="text-[13px] text-gray-400 mb-5">
            Manage your saved payout methods. Set a default method for quick withdrawals.
          </p>

          <div className="grid grid-cols-2 gap-3  max-sm:grid-cols-1">
            <BankCard name="Ashin Raj M" last4="4321" isDefault />
            <BankCard name="Ashin Raj M" last4="4321" />
            <UpiCard upiId="yourname@upi" />
          </div>

          <div className="flex justify-end mt-2">
            <Button variant="outline" className="text-[#013913]">
                Add New Account
            </Button>
          </div>
        </div>

        {/* ── Insights ── */}
        <div className=" rounded-2xl pl-2">
  {/* Header */}
  <div className="flex items-center gap-2 mb-4">
    <Image src={insightsIcon} alt="Insights" width={20} height={20} />
    <p className="text-[18px] font-semibold text-gray-900">Insights</p>
  </div>

  {/* Charts grid */}
  <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">

    {/* Earnings Card */}
    <div className="bg-white rounded-xl p-4 border border-[#ECECEC]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900">Earnings</p>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="bg-transparent text-xs text-gray-500 outline-none cursor-pointer"
        >
          {['January', 'February', 'March', 'April', 'May', 'June'].map(m => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <AreaChart
          data={earningsData}
          margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#246AF3E0" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#246AF31A" stopOpacity={0.1}/>
            </linearGradient>
          </defs>

          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
          />

          <Tooltip content={<EarningsTooltip />} />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#246AF3E0"
            strokeWidth={2}
            fill="url(#earningsGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>

    {/* Posts Card */}
    <div className="bg-white rounded-xl p-4 border border-[#ECECEC]">
      <div className="flex items-center gap-4 mb-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
          sold
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E8E8D8]" />
          posts
        </div>
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <BarChart
          data={postsData}
          barGap={4}
          margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
        >
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<PostsTooltip />} />

          <Bar
            dataKey="sold"
            fill="#22C55E"
            radius={[6, 6, 0, 0]}
            barSize={18}
          />

          <Bar
            dataKey="posts"
            fill="#E8E8D8"
            radius={[6, 6, 0, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>

  </div>
</div>

      </div>
    </div>
  )
}

export default Earnings