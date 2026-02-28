import { onBoardUser } from '@/modules/auth'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

export const Layout = async ({ children }) => {
    await onBoardUser()
    return (
        <main className='flex flex-col-1 items-center justify-center h-screen w-screen'>
            <UserButton />
            <div>{children}</div>
        </main>
    )
}
