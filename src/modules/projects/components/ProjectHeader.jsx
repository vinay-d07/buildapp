import React from 'react'
import { useTheme } from 'next-themes'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon, ChevronLeftIcon, Edit2Icon, SunMoonIcon } from 'lucide-react'
import Link from 'next/link'
import { useGetProjectsbyId } from '../hooks/project'
export const ProjectHeader = ({ id }) => {
    const { data: project, isLoading } = useGetProjectsbyId(id)
console.log(project)
    const { theme, setTheme } = useTheme()
    return (
        <div className='flex items-center justify-betweenmt mt-14 bg-card  border-b border-border shadow-sm'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-2 flex items-center gap-2 h-12 px-4 hover:bg-accent hover:text-accent-foreground transition-colors duration-200 shadow-sm border-border">
                        <ChevronDownIcon className="h-4 w-4" />
                        <span className="font-medium text-lg font-mono">{project && project[0]?.name || 'untitled'}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="center" className="z-[60] mt-4 bg-popover border-border shadow-lg">
                    <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center gap-3 w-full p-2"
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                            <span className="font-medium">GO TO DASHBOARD</span>
                        </button>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center gap-3 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer">
                            <SunMoonIcon className="h-4 w-4" />
                            <span className="font-medium">CHANGE THEME</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent sideOffset={5} className="bg-popover border-border shadow-lg">
                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                    <DropdownMenuRadioItem value="light" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">LIGHT</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">DARK</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

