import { Button } from '@/components/ui/button'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import ModeToggle from '@/components/ModeToggle'

const Navbar = () => {
    return (
        <nav className='p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent dark:bg-background dark:border-border'>
            <div className='flex items-center justify-between m-w-5xl mx-auto'>
                <Link href='/' className='flex items-center gap-2'>
                    <span className='text-xl font-bold dark:text-foreground'>BUILDAPPS</span>
                </Link>
                <SignedIn className='flex items-center gap-2  '>
                    <div className='flex items-center gap-[10px]'>
                        <UserButton />
                        <SignOutButton>
                            <Button variant='outline'>Sign Out</Button>
                        </SignOutButton>
                        <ModeToggle />
                    </div>
                </SignedIn>
                <SignedOut className='flex items-center gap-2 mx-4 p-5'>
                    <SignInButton>
                        <Button variant='ghost'>Sign In</Button>
                    </SignInButton>
                </SignedOut>
            </div>


        </nav>
    )
}

export default Navbar