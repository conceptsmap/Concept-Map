import Layout from '@/layout/components/Layout'
import React from 'react'

const DashboardPage = () => {
  return (
    <Layout>
      <div className='p-6'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <p className='text-gray-600 mt-2'>Welcome to your dashboard</p>
      </div>
    </Layout>
  )
}

export default DashboardPage