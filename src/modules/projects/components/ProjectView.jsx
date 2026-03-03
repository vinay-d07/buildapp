
"use client"
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { ProjectHeader } from './ProjectHeader'
import { Button } from '@/components/ui/button'
import { MessageContainer } from '@/modules/messages/components/MessageContainer'

export const ProjectView = ({ id }) => {

    const [activeFragment, setActiveFragment] = useState(null)

    return (
        <div className='h-screen'>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-0">
                    {/* left panel */}
                    <ProjectHeader id={id} className="" />
                    <MessageContainer projectId={id} activeFragment={activeFragment} setActiveFragment={setActiveFragment} />
                </ResizablePanel>

                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={65} minSize={20} className="flex flex-col min-h-0">
                    {/* code and demo */}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
