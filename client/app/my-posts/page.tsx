import React from 'react'

import Navbar from '@/layout/components/Navbar';
import Post, { PostProps } from '../dashboard/components/Post';
import { posts } from '../dashboard/components/posts';

const DashboardPage = () => {
    return (
        <>
            <div className=" gap-4 items-start">
                {/* LEFT */}
                <div className="flex-1 gap-3 flex flex-col">
                    {posts.map((post: PostProps) => (
                        <Post
                            key={post.id}
                            {...post}
                        />
                    ))}
                </div>
                {/* RIGHT */}
            </div>
        </>
    );
}

export default DashboardPage
