import React, { useRef } from 'react'
import { preFetch, useGetMessgaes } from '../hooks/messages'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { MessageRole, MessageType } from '@/generated/prisma/enums'
import { Loader } from 'lucide-react'
import MessageCard from './MessageCard'
import MessageForm from './MessageForm'
import { ThinkingMessage } from './ThinkingMessage '


export const MessageContainer = ({ projectId, activeFragment, setActiveFragment }) => {
    const queryClient = useQueryClient()
    const BottomRef = useRef(null)
    const LastAssitantMessageRef = useRef(null)
    const { data: messages, isLoading, isError } = useGetMessgaes(projectId)

    useEffect(() => {
        console.log("activeFragment?.id === message.fragments?.id ", activeFragment?.id === messages?.fragments?.id)
        if (projectId) {
            preFetch(queryClient, projectId)
        }
    }, [projectId, queryClient])

    useEffect(() => {
        const LastAssitantMessage = messages?.findLast((msg) => {
            msg.role === MessageRole.ASSISTANT
        })

        if (LastAssitantMessage?.fragments && LastAssitantMessage?.id != LastAssitantMessageRef.current) {
            setActiveFragment(LastAssitantMessage?.fragments)
            LastAssitantMessageRef.current = LastAssitantMessage.id
        }
    }, [messages, setActiveFragment])



    if (isLoading) {
        return <div className='flex justify-center items-center h-full'><Loader className='animate-spin' /></div>
    }
    if (isError) {
        return <div className='flex justify-center items-center h-full'>Error</div>
    }

    if (messages?.length === 0) {
        return <div className='flex justify-center items-center h-full'>
            No Messages
            <MessageForm projectId={projectId} />
        </div>
    }

    const lastMessage = messages[messages.length - 1];
    const isLastMessageUser = lastMessage.role === MessageRole.USER
    return (
        <div className='flex flex-col flex-1 min-h-0 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black'>
            <div className='flex flex-col flex-1 min-h-0 overflow-y-auto'>
                {
                    messages.map((message) => (
                        <MessageCard key={message.id}
                            content={message.content}
                            role={message.role}
                            type={message.type}
                            fragments={message.fragments}
                            createdAt={message.createdAt}
                            isActiveFragment={activeFragment?.id === message.fragments?.id}
                            onFragmentClick={() => setActiveFragment(message.fragments)} />


                    ))

                }
                {isLastMessageUser && <ThinkingMessage />}
            </div>
            <div ref={BottomRef} />

            <div className='relative p-2'>
                <div className="absolute -top-6 left-0 right-0 h-6 
                bg-gradient-to-b 
                from-transparent to-background 
                pointer-events-none" />
                <MessageForm projectId={projectId} />
            </div>
        </div>
    )
}
