"use client"

import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Notifications from './Notifications'
import Ads from './Ads'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-[#F5F5F5] p-2 flex gap-2'>
      <Sidebar />
      <div className='flex-1 flex flex-col gap-2'>
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