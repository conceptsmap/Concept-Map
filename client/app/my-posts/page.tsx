'use client'

import React, { useEffect, useState } from 'react'

import Post, { PostProps, } from '../dashboard/components/Post';
import PostSkeleton from '../dashboard/components/PostSkelton';

interface ApiScript {
    _id: string;
    main_title?: string;
    title?: string;
    description?: string;
    type?: string[];
    likes?: number;
    comments?: number;
    synopsis?: { price?: number; currency?: string; content?: string };
    script?: { price?: number; currency?: string; content?: { name: string; scenes: { name: string; description: string }[] }[] };
    story_borad?: { price?: number; currency?: string; content?: { name: string; cloud_url: string }[] };
    userId?: { _id: string; username?: string; role?: string; profile_url?: string, jobRole?: string };
}

type PostType = 'all' | 'synopsis' | 'storyboard' | 'story_board' | 'script';

const categories: PostType[] = ['all', 'synopsis', 'storyboard', 'script'];

const MyPostsPage = () => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activePostType, setActivePostType] = useState<PostType>('all');


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setError('Please log in to view your posts');
                    setLoading(false);
                    return;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
                const res = await fetch(`${apiUrl}/web/script/all/details`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                if (res.ok && data?.data) {
                    const mappedPosts: PostProps[] = data.data.map((script: ApiScript) => {
                        // Determine post type
                        let postType: PostType = 'script';
                        if (script.type?.includes('SYNOPSIS')) postType = 'synopsis';
                        else if (script.type?.includes('STORY_BOARD')) postType = 'story_board';

                        return {
                            id: script._id,
                            author: script.userId && typeof script.userId === 'object'
                                ? {
                                    name: script.userId.username || 'Unknown',
                                    jobRole: script.userId.jobRole || '',
                                    avatar: script.userId.profile_url || '',
                                    profile: script.userId.profile_url || '',
                                }
                                : { name: 'Unknown', role: '', avatar: '' },
                            title: script.main_title || script.title || 'Untitled',
                            type: postType,
                            likes: script.likes || 0,
                            comments: script.comments || 0,
                            rightsLabel: 'Basic / Exclusive Rights',
                            synopsis: script.synopsis?.content,
                            description: script.description || '',
                            script: script.script,
                            storyboard: script.story_borad?.content?.[0]?.cloud_url
                                ? { image: script.story_borad.content[0].cloud_url }
                                : undefined,
                        };
                    });
                    setPosts(mappedPosts);
                } else {
                    setError(data?.message || 'Failed to fetch your posts');
                }
            } catch (err) {
                console.error('Failed to fetch posts:', err);
                setError('Failed to fetch your posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Filter posts based on selected type
    const filteredPosts = activePostType === 'all'
        ? posts
        : posts.filter((post) => post.type === (activePostType == "storyboard" ? "story_board" : activePostType));

    return (
        <>
            <div className="gap-4 items-start">
                {/* LEFT */}

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
                <div className="flex-1 gap-3 flex flex-col">
                    {loading ? (
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton />
                        </>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">
                            {error}
                        </div>
                    ) : filteredPosts.length > 0 ? (
                        filteredPosts.map((post: PostProps) => (
                            <Post
                                key={post.id}
                                {...post}
                                locked={false}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No posts yet. Create your first post!
                        </div>
                    )}
                </div>
                {/* RIGHT */}
            </div>
        </>
    );
}

export default MyPostsPage
