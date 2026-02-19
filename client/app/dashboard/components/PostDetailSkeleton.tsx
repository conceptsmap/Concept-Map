'use client'

import { Skeleton } from '@/components/ui/skeleton'

const PostDetailSkeleton = () => {
    return (
        <div className="w-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="w-5 h-5" />
                </div>
            </div>

            {/* Title */}
            <Skeleton className="h-8 w-full mb-3" />

            {/* Description */}
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-4/5 mb-4" />

            {/* Hashtags */}
            <div className="flex gap-2 mb-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
            </div>

            {/* Content Box */}
            <div className="relative mt-4 rounded-xl bg-[#F5F5F5] p-5 mb-4">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>

            {/* Rights Badge */}
            <Skeleton className="h-8 w-48 mb-4" />

            {/* Purchase Section */}
            <div className="flex items-center justify-end gap-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    )
}

export default PostDetailSkeleton
