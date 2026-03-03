import { Card } from '@/components/ui/card'
import { MessageRole, MessageType } from '@/generated/prisma/enums'
import { cn } from '@/lib/utils'
import React from 'react'
import { FragmentCard } from './FragmentCard'

const UserMessage = ({ content }) => {
    return (
        <div className="flex justify-end px-3 py-2">
            <div className="bg-black text-white font-mono dark:bg-white dark:text-black text-sm px-3 py-3 rounded-xl max-w-[70%] break-words">
                {content}
            </div>
        </div>
    )
}

const AssistantMessage = ({
    content,
    type,
    fragments,
    createdAt,
    isActiveFragment,
    onFragmentClick
}) => {
    return (
        <div className="flex flex-col px-3 py-1">
            <div className="flex justify-start">
                <div
                    onClick={onFragmentClick}
                    className={cn(
                        "text-sm px-3 py-2 rounded-xl max-w-[70%] break-words transition-colors",
                        type === MessageType.ERROR && "text-red-600 dark:text-red-400",
                        isActiveFragment
                            ? "bg-neutral-200 dark:bg-neutral-800"
                            : "bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    )}
                >
                    <div className="whitespace-pre-wrap font-mono">{content}
                       
                    </div>
                     {fragments && type === MessageType.RESULT && (
                           <FragmentCard isActive={isActiveFragment} fragment={fragments} onFragmentClick={onFragmentClick}/>
                        )}  


                </div>
            </div>

            {createdAt && (
                <div className="text-[10px] opacity-40 mt-1 ml-1">
                    {new Date(createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </div>
            )}
        </div>
    )
}

const MessageCard = (props) => {
    if (props.role === MessageRole.ASSISTANT) {
        return <AssistantMessage {...props} />
    }
    return <UserMessage content={props.content} />
}

export default MessageCard