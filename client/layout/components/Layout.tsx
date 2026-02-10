"use client"

import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Notifications from './Notifications'
import Ads from './Ads'
import dynamic from 'next/dynamic';

const SearchWithSuggestionsBar = dynamic(() => import('@/components/SearchWithSuggestionsBar'), { ssr: false });

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const showSearchBar = pathname !== '/' && !pathname.startsWith('/login');
  return (
    <div className='bg-[#F5F5F5] p-2 flex gap-2'>
      <Sidebar />
      <div className='flex-1 flex flex-col gap-2'>
        {showSearchBar && <SearchWithSuggestionsBar />}
        <Navbar />
        <main className='flex-1'>
          {children}
        </main>
      </div>
      {/* <Notifications /> */}
      <Ads />
    </div>
  )
}

export default Layout