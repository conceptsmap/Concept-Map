import React from 'react'
import BuyerSidebar from './BuyerSidebar'
import Navbar from './Navbar'
import Notifications from './Notifications'
import Ads from './Ads'

const BuyerLayout = () => {
  return (
    <div className='bg-[#F5F5F5] p-2 flex '>
      <BuyerSidebar />
      <Navbar />
      {/* <Notifications /> */}
      <Ads />
    </div>
  )
}

export default BuyerLayout