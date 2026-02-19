'use client'

import close from '@/assets/icons/close.svg'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import PaymentMethod from './components/PaymentMethod'
import { useSearchParams, useRouter } from 'next/navigation'
import LoadingScreen from './components/LoadingScreen'
import SkeletonCheckoutLoader from './components/SkeletonCheckoutLoader'

interface PostData {
    id: string
    title: string
    type: string
    price: number
    seller: {
        name: string
        email?: string
    }
}

interface BuyerData {
    name: string
    email: string
    phone?: string
}

const CheckoutPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const postId = searchParams.get('postId')

    const [post, setPost] = useState<PostData | null>(null)
    const [buyer, setBuyer] = useState<BuyerData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!postId) {
                setLoading(false)
                return
            }

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

                // Fetch post data
                const postRes = await fetch(`${apiUrl}/web/script/${postId}`)
                const postData = await postRes.json()

                if (postRes.ok && postData?.data) {
                    const script = postData.data
                    const postType = Array.isArray(script.type) && script.type.length > 0
                        ? script.type[0].replace('_', ' ')
                        : 'Script'

                    const price = script.script?.price || script.synopsis?.price || script.story_borad?.price || 0

                    setPost({
                        id: script._id,
                        title: script.main_title || script.title || 'Untitled',
                        type: postType,
                        price: price,
                        seller: {
                            name: script.userId?.username || 'Unknown Seller',
                            email: script.userId?.email,
                        }
                    })
                }

                // Fetch buyer data from localStorage
                const token = localStorage.getItem('auth_token')
                if (token) {
                    const userRes = await fetch(`${apiUrl}/web/user/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const userData = await userRes.json()
                    if (userRes.ok && userData?.data) {
                        setBuyer({
                            name: userData.data.username || 'Unknown',
                            email: userData.data.email || '',
                            phone: userData.data.phone || ''
                        })
                    }
                }
            } catch (error) {
                console.error('Failed to fetch checkout data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [postId])

    // if (loading && ) {
    //     return <LoadingScreen />
    // }

    if (loading) {
        return <SkeletonCheckoutLoader />
    }

    if (!postId || !post) {
        return (
            <div className="min-h-screen bg-[#F4F6F5] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-700">No item selected</h2>
                    <p className="text-gray-500 mt-2">Please select an item to purchase</p>
                </div>
            </div>
        )
    }

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

                        <button
                            className="rounded-full p-1 hover:bg-gray-100"
                            onClick={() => router.back()}
                        >
                            <Image src={close} alt="Close" width={20} height={20} />
                        </button>
                    </div>


                    <section className="mb-6">
                        <h3 className="mb-3 text-base font-bold text-gray-900">
                            Order Summary
                        </h3>

                        <div className="space-y-2 text-sm">
                            <Row label="Item" value={post.title} />
                            <Row label="Type" value={post.type} />
                            <Row label="Seller" value={post.seller.name} />
                            <Row
                                label="Price"
                                value={`₹${post.price.toLocaleString()}`}
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
                            <Row label="Buyer" value={buyer?.name || 'Guest'} />
                            <Row label="Email" value={buyer?.email || 'Not provided'} />
                            <Row label="Phone" value={buyer?.phone || 'Not provided'} />
                        </div>
                    </section>

                </div>
            </div>
            <PaymentMethod price={post.price.toLocaleString()} />
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