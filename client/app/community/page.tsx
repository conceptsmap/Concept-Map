"use client";
import React from 'react'
import Layout from '@/layout/components/Layout'
import CommunityPost from './components/CommunityPost'
import { communityPosts } from './dummyData'
import Notifications from '@/layout/components/Notifications'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MessageCirclePlus,
  MessagesSquare,
  Users,
  Table2,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";

function DiscussionSelector() {
  const router = useRouter();


  const handleCreateDiscussion = () => {
    router.push("/community/create");
  };

  const handleMyDiscussions = () => {
    router.push("/community/id");
  };

  const handleJoinDiscussion = () => {
    router.push("/community/");
  };

  return (
    <div className="w-full xl:max-w-75 lg:max-w-56 rounded-2xl bg-white p-5 shadow-md space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-bold flex items-center">
          <Table2 className="h-4 w-4 mr-1 inline" />
          Discussions
        </h3>
        <p className="text-sm text-gray-500">
          Create, manage or join creative discussions.
        </p>
      </div>

      <div className="space-y-3">
        <DiscussionItem
          icon={<MessageCirclePlus className="h-5 w-5" />}
          bg="bg-green-600"
          title="Create Discussion"
          desc="Start a new discussion"
          onClick={handleCreateDiscussion}
        />

        <DiscussionItem
          icon={<MessagesSquare className="h-5 w-5" />}
          bg="bg-blue-600"
          title="My Discussions"
          desc="View discussions you created"
          onClick={handleMyDiscussions}
        />

        <DiscussionItem
          icon={<Users className="h-5 w-5" />}
          bg="bg-purple-600"
          title="Join Discussion"
          desc="Explore and join discussions"
          onClick={handleJoinDiscussion}
        />
      </div>
    </div>
  );
}

function DiscussionItem({
  icon,
  bg,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-xl border p-3 hover:bg-gray-50 transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center text-white`}>
          {icon}
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
      </div>

      <Button size="icon" variant="ghost">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}


const CommunityPage = () => {
  return (

    <div className="flex gap-4 items-start mt-2">
      <div className="flex-1">

        {communityPosts.map(post => (
          <CommunityPost key={post.id} post={post} />
        ))}
      </div>
      <div className="flex flex-col gap-4 shrink-0   xl:max-w-75
        lg:max-w-56">
        <DiscussionSelector />
        <Notifications />
      </div>
    </div>
  )
}

export default CommunityPage
