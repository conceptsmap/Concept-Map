'use client'

import { Skeleton } from '@/components/ui/skeleton'

const SkeletonCheckoutLoader = () => {
    return (
        <div className='flex gap-3'>
            <div className="min-h-screen bg-[#F4F6F5] flex items-top justify-center gap-3 w-full">
                <div className="w-full rounded-3xl bg-white shadow-sm p-6">

                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="w-full">
                            <Skeleton className="h-8 w-80 mb-3" />
                            <Skeleton className="h-4 w-96" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </div>

                    {/* Order Summary Section */}
                    <div className="mb-6">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-40 ml-auto" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <Skeleton className="h-px my-4 w-full" />

                    {/* Buyer Details Section */}
                    <div>
                        <Skeleton className="h-6 w-40 mb-4" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-40 ml-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Payment Method Skeleton */}
                <div className="w-[399px]">
                    <div className="rounded-3xl bg-white shadow-sm p-6 min-h-[520px]">
                        <Skeleton className="h-8 w-48 mb-6" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-32 mb-2" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ))}
                        </div>
                        <Skeleton className="h-12 w-full mt-8" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkeletonCheckoutLoader
