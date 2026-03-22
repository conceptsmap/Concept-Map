"use client"

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar'
import Notifications from './Notifications'
import Ads from './Ads'
import dynamic from 'next/dynamic';
import PostCreativeSelector from './Creative'

const SearchWithSuggestionsBar = dynamic(
  () => import('@/components/SearchWithSuggestionsBar'),
  { ssr: false }
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() ?? '';

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const showSearchBar =
    pathname !== '/' &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/signup') &&
    !pathname.startsWith('/checkout');

  const hideNotificationsRoutes = [
    "/checkout",
    "/search",
    "/community"
  ];

  const showNotifications =
    pathname !== '/' &&
    !pathname.includes('/search') &&
    !hideNotificationsRoutes.includes(pathname);

  return (
    <div className='h-dvh bg-[#F5F5F5] p-2 flex gap-3'>
      <Sidebar />

      <div className='flex-1 min-w-0 flex flex-col gap-2 '>
        {showSearchBar && <SearchWithSuggestionsBar />}

        <main className='flex-1 overflow-y-auto overscroll-contain no-scrollbar '>
          {children}
        </main>
      </div>

      {showNotifications && (
        <div className="hidden md:flex flex-col gap-4 shrink-0 xl:max-w-75 lg:max-w-56">
          <PostCreativeSelector />
          <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar">
            <Notifications />
          </div>
        </div>
      )
      }

      <Ads />
    </div >
  )
}

export default Layout