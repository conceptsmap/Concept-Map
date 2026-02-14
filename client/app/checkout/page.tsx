import close from '@/assets/icons/close.svg'
import React from 'react'
import Image from 'next/image'
import PaymentMethod from './components/PaymentMethod'

const CheckoutPage = () => {
    return (
        <div className='flex gap-3'>
            <div className="min-h-screen bg-[#F4F6F5] flex items-top justify-center gap-3 w-full">

                <div className="w-full rounded-3xl bg-white shadow-sm p-6">

                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <h2 className="text-xl font-bold">
                                Checkout – Secure Your Purchase
                            </h2>
                            <p className="text-sm text-gray-500 my-1">
                                Fast, Secure, and Hassle-Free Transactions
                            </p>
                        </div>

                        <button className="rounded-full p-1 hover:bg-gray-100">
                            <Image src={close} alt="Close" width={20} height={20} />
                        </button>
                    </div>


                    <section className="mb-6">
                        <h3 className="mb-3 text-base font-bold text-gray-900">
                            Order Summary
                        </h3>

                        <div className="space-y-2 text-sm">
                            <Row label="Item" value="The Perfect Heist – A Crime Thriller" />
                            <Row label="Type" value="Full Script" />
                            <Row label="Seller" value="John Doe" />
                            <Row
                                label="Price"
                                value="₹6,000"
                                valueClass="text-green-600 font-semibold"
                            />
                        </div>
                    </section>

                    <div className="my-4 h-px bg-gray-100" />

                    <section>
                        <h3 className="mb-3 text-base font-bold text-gray-900">
                            Buyer Details
                        </h3>

                        <div className="space-y-2 text-sm">
                            <Row label="Buyer" value="John Smith" />
                            <Row label="Email" value="johnsmith@email.com" />
                            <Row label="Phone" value="9876543210" />
                        </div>
                    </section>

                </div>
            </div>
            <PaymentMethod />
        </div>
    )
}

export default CheckoutPage


const Row = ({
    label,
    value,
    valueClass = "",
}: {
    label: string
    value: string
    valueClass?: string
}) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <span className="text-[#BEBEBE]">{label}</span>
            <span className={`text-right text-[#484848] font-bold ${valueClass}`}>{value}</span>
        </div>
    )
}