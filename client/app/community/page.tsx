import React from 'react'
import Layout from '@/layout/components/Layout'
import CommunityPost from './components/CommunityPost'
import { communityPosts } from './dummyData'


const CommunityPage = () => {
  return (

      <div className="mx-auto space-y-6">
        {communityPosts.map(post => (
          <CommunityPost key={post.id} post={post} />
        ))}
      </div>
  )
}

export default CommunityPage
