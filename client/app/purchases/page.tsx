'use client'
import React, { useState } from 'react'

import Post, { PostProps } from '../dashboard/components/Post';
import { posts } from '../dashboard/components/posts';

type PostType = 'all' | 'synopsis' | 'storyboard' | 'script';

const categories: PostType[] = ['all', 'synopsis', 'script', 'storyboard'];

const SavedPage = () => {
    const [activePostType, setActivePostType] = useState<PostType>('all');

    // Filter posts based on selected type
    const filteredPosts = activePostType === 'all'
        ? posts
        : posts.filter((post) => post.type === activePostType);

    return (
        <>
            <div className="gap-4 items-start">
                {/* Post Type Filter */}
                <div className="w-full min-w-0 overflow-hidden">
                    <div
                        className="
                            flex overflow-x-auto gap-3 scrollbar-hide
                            rounded-2xl bg-[#F5F7F6]
                            py-2
                            [&::-webkit-scrollbar]:hidden
                            [-ms-overflow-style:none]
                            [scrollbar-width:none]
                        "
                    >
                        {categories.map((item) => {
                            const isActive = activePostType === item

                            return (
                                <button
                                    key={item}
                                    onClick={() => setActivePostType(item)}
                                    className={`
                                        whitespace-nowrap
                                        rounded-xl px-6 py-2 text-sm font-medium
                                        transition-all duration-200 
                                        capitalize
                                        ${isActive
                                            ? "bg-[#013913] text-white shadow-sm"
                                            : "bg-white text-gray-800 hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    {item}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Posts List */}
                <div className="flex-1 gap-3 flex flex-col">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post: PostProps) => (
                            <Post
                                key={post.id}
                                {...post}
                                locked={false}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            {activePostType === 'all'
                                ? 'No saved posts yet. Save your first post!'
                                : `No saved ${activePostType}s yet. Save your first ${activePostType}!`
                            }
                        </div>
                    )}
                </div>
                {/* RIGHT */}
            </div>
        </>
    );
}

export default SavedPage
