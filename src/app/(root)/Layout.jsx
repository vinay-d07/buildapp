import { onBoardUser } from '@/modules/auth'
import Navbar from '@/modules/home/components/navbar'

import React from 'react'

export const Layout = ({ children }) => {
    // Note: onBoardUser was removed since Layout is now sync
    // Consider moving this to a middleware or separate server component
    return (
            <main className='flex flex-col-1 items-center justify-center h-screen w-screen'>
                <Navbar />
                <div>{children}</div>
            </main>
    )
}
