import Creative from '@/layout/components/Creative'
import Layout from '@/layout/components/Layout'
import Notifications from '@/layout/components/Notifications'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Layout>
                <div className="flex gap-4 items-start">
                    <div className='flex-1'>

{children}
                    </div>
<div className="flex flex-col gap-4 shrink-0 w-[245px]">
                <Creative />
                <Notifications />
              </div>
              </div>
    </Layout>
  )
}

export default layout