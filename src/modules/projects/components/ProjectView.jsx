
"use client"
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import { ProjectHeader } from './ProjectHeader'
import { Button } from '@/components/ui/button'
import { MessageContainer } from '@/modules/messages/components/MessageContainer'
import { Code2Icon, CrownIcon, EyeIcon } from 'lucide-react'
import Link from 'next/link'
import { FragmentWeb } from './FragmentWeb'
import { FileExplorer } from '@/components/ui/FileExplorer'

export const ProjectView = ({ id }) => {
    console.log("PROJECT VIEW RENDERED")
    const [activeFragment, setActiveFragment] = useState(null)
    const [tabState, setTabState] = useState("preview")
    useEffect(() => {
        console.log("files in ProjectView   ", activeFragment?.[0]?.files)
        console.log("tabState", tabState)
    }, [tabState, activeFragment])
    return (
        <div className='h-screen'>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={35} minSize={20} className="flex flex-col min-h-0">
                    {/* left panel */}
                    <ProjectHeader id={id} className="" />
                    <MessageContainer projectId={id} activeFragment={activeFragment} setActiveFragment={setActiveFragment} />
                </ResizablePanel>

                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={65} minSize={20} className="flex flex-col min-h-0 mt-16">
                    <Tabs className={"h-full w-full flex flex-col"}
                        defaultValue="preview" value={tabState}
                        onValueChange={(val) => setTabState(val)}>
                        <div className='w-full flex items-center border-b gap-x-2'>
                            <TabsList className={"h-8 border rounded-md"}>
                                <TabsTrigger value="preview" className={"rounded-md px-3 flex items-center gap-x-2"}>
                                    Preview
                                    <EyeIcon />
                                </TabsTrigger>
                                <TabsTrigger value="code" className={"rounded-md px-3 flex items-center gap-x-2"}>
                                    CODE
                                    <Code2Icon />
                                </TabsTrigger>
                            </TabsList>

                            <div className='ml-auto flex items-center gap-x-2'>
                                <Button asChild><Link href={"/pricing"}><CrownIcon className='size-4 mr-2' />UPGRADE</Link></Button>
                            </div>
                        </div>


                        <TabsContent
                            value="preview"
                            className={"flex h-[calc(100%-4rem)] overflow-hidden"}>
                            {activeFragment ? (<>
                                <FragmentWeb data={activeFragment} /></>) :
                                (
                                    <div className='flex justify-center items-center text-muted-foreground h-full'>
                                        SELECT A FRAGMENT FOR PREVIEW</div>
                                )}
                        </TabsContent>
                        <TabsContent value="code" className={"flex-1 h-[calc(100%-4rem)] overflow-hidden"}>
                            {activeFragment && activeFragment.length > 0 ? (<>
                                <FileExplorer files={activeFragment[0]?.files} /></>) : (<><div className='flex justify-center items-center text-muted-foreground h-full'>
                                    SELECT A FRAGMENT TO VIEW</div></>)}

                        </TabsContent>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
