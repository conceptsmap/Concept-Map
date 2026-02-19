"use client";

import React, { useEffect, useState } from 'react'
import Post, { PostProps, PostType } from './components/Post'
import Navbar from '@/layout/components/Navbar';
import PostSkeleton from './components/PostSkelton';

interface ApiScript {
  _id: string;
  main_title?: string;
  title?: string;
  description?: string;
  genre?: string;
  type?: string[];
  likes?: number;
  comments?: number;
  synopsis?: { price?: number; currency?: string; content?: string };
  script?: { price?: number; currency?: string; content?: { name: string; scenes: { name: string; description: string }[] }[] };
  story_borad?: { price?: number; currency?: string; content?: { name: string; cloud_url: string }[] };
  userId?: { _id: string; username?: string; role?: string; profile_url?: string, jobRole?: string };
}

const DashboardPage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [allPosts, setAllPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const res = await fetch(`${apiUrl}/web/script/all`);
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
              description: script.description || '',
              rightsLabel: 'Basic / Exclusive Rights',
              synopsis: script.synopsis?.content,
              script: script.script,
              storyboard: script.story_borad?.content?.[0]?.cloud_url
                ? { image: script.story_borad.content[0].cloud_url }
                : undefined,
              genres: script.genre ? [script.genre] : [],
            };
          });
          setAllPosts(mappedPosts);
          setPosts(mappedPosts);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on selected category
  useEffect(() => {
    if (selectedCategory === 'ALL') {
      setPosts(allPosts);
    } else {
      const filtered = allPosts.filter((post) =>
        post.genres?.includes(selectedCategory)
      );
      setPosts(filtered);
    }
  }, [selectedCategory, allPosts]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <div className="gap-4 items-start">
        <Navbar
          activeCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        {/* LEFT */}
        <div className="flex-1 gap-3 flex flex-col">
          {loading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : posts.length > 0 ? (
            posts.map((post: PostProps) => (
              <Post
                key={post.id}
                {...post}
              />
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              No posts available in {selectedCategory === 'ALL' ? 'this category' : selectedCategory}. Be the first to create one!
            </div>
          )}
        </div>
        {/* RIGHT */}
      </div>
    </>
  );
}

export default DashboardPage
