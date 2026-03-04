import { CopyCheck, CopyCheckIcon, CopyIcon, CopyXIcon } from 'lucide-react'
import React, { useState, useMemo, useCallback, Fragment } from 'react'
import { Button } from './button'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Hint } from './Hint'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './resizable'
import { TreeView } from './TreeView'
import { FileBreadCrumb } from './FileBreadCrumb'
import { CodeView } from '../CodeView'
import { convertFilesToTreeItems } from '@/lib/utils'


function getLanguageFromExtension(filename) {
    const extension = filename.split(".").pop()?.toLowerCase();

    const languageMap = {
        js: "javascript",
        jsx: "jsx",
        ts: "typescript",
        tsx: "tsx",
        py: "python",
        html: "html",
        css: "css",
        json: "json",
        md: "markdown",
    };

    return languageMap[extension] || "text";
}


export const FileExplorer = ({ files }) => {
    console.log("files", files)
    const [copied, setCopied] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState(() => {
        if (!files || typeof files !== 'object') return null
        const filekey = Object.keys(files)
        return filekey.length > 0 ? filekey[0] : null
    })

    const treeData = useMemo(() => {
        if (!files || typeof files !== 'object') return []
        return convertFilesToTreeItems(files)
    }, [files])

    const handleFileSelect = useCallback((path) => {
        if (files && files[path]) {
            setSelectedFiles(path)
        }
    }, [files])

    const handleCopy = useCallback(() => {
        if (files && selectedFiles && files[selectedFiles]) {
            const contentToCopy = typeof files[selectedFiles] === 'string' ? files[selectedFiles] : files[selectedFiles]?.content || '';
            if (contentToCopy) {
                navigator.clipboard.writeText(contentToCopy)
                    .then(() => {
                        setCopied(true)
                        setTimeout(() => {
                            setCopied(false)
                        }, 2000)
                    })
            }
        }
    }, [selectedFiles, files])
    return (
        <ResizablePanelGroup direction="horizontal" className={"h-full"}>
            <ResizablePanel
                defaultSize={30}
                minSize={25}
                maxSize={40}
                className="bg-sidebar min-h-0"
            >
                <div className="h-full w-full overflow-auto">
                    <TreeView
                        data={treeData}
                        value={selectedFiles}
                        onSelect={handleFileSelect}
                        selectedPath={selectedFiles}
                    />
                </div>
            </ResizablePanel>

            <ResizableHandle className="hover:bg-primary/20" />

            {/* CODE VIEW */}
            <ResizablePanel
                defaultSize={70}
                minSize={60}
                className="bg-sidebar min-h-0"
            >
                {selectedFiles && files[selectedFiles] ? (<>
                    <div className="h-full w-full flex flex-col">
                        <div className='border-b bg-sidebar/50 flex justify-between items-center p-2 gap-x-2'>
                            <FileBreadCrumb filePath={selectedFiles} />
                            <Hint text="Copy file content">
                                <Button variant="ghost" onClick={handleCopy}>
                                    {copied ? <CopyCheckIcon /> : <CopyXIcon />}
                                </Button>
                            </Hint>
                        </div>
                        <div className="flex-1 overflow-auto relative">
                            <CodeView code={typeof files[selectedFiles] === 'string' ? files[selectedFiles] : files[selectedFiles]?.content || ''} lang={getLanguageFromExtension(selectedFiles)} />
                        </div>
                    </div></>) :
                    (<div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No file selected</p>
                    </div>)}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
