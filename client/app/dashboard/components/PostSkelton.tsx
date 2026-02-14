"use client";
import React from "react";

const PostSkeleton = () => {
    return (
        <div className="w-full rounded-xl bg-white p-6 shadow-sm border my-3 border-gray-100 animate-pulse">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gray-200" />

                    {/* Name + role */}
                    <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                        <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className="h-4 w-10 bg-gray-200 rounded" />
                    <div className="h-4 w-10 bg-gray-200 rounded" />
                    <div className="h-4 w-4 bg-gray-200 rounded-full" />
                </div>
            </div>

            {/* Title & Genres */}
            <div className="mb-3 space-y-2">
                <div className="h-5 w-2/3 bg-gray-200 rounded" />
                <div className="h-3 w-1/3 bg-gray-200 rounded" />
            </div>

            {/* Content Box */}
            <div className="relative rounded-lg bg-[#F5F5F5] p-4 mb-4">
                <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                        <div className="h-3 w-full bg-gray-200 rounded" />
                        <div className="h-3 w-full bg-gray-200 rounded" />
                        <div className="h-3 w-5/6 bg-gray-200 rounded" />
                        <div className="h-3 w-2/3 bg-gray-200 rounded" />
                    </div>

                    {/* Type badge */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                        <div className="h-6 w-16 bg-gray-200 rounded-md" />
                        <div className="h-8 w-8 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Rights badge */}
            <div className="mb-4">
                <div className="h-6 w-48 bg-gray-200 rounded-lg" />
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3">
                <div className="h-10 flex-1 bg-gray-200 rounded-md" />
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                <div className="h-10 w-24 bg-gray-200 rounded-md" />
            </div>
        </div>
    );
};

export default PostSkeleton;
