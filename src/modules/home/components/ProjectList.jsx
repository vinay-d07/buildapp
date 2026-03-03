
"use client"
import React from 'react'
import { useGetProjects } from '@/modules/projects/hooks/project'
import { Corousel, CorouselContent, CorouselItem, CorouselPrevious, CorouselNext } from '@/components/ui/carousel'
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderKanban, Calendar, ArrowRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
export const ProjectList = () => {
    const { data: projects, isLoading } = useGetProjects()
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }
    if (isLoading) {
        return <div>
            <h2 className='text-2xl font-bold text-center md:text-left md:text-3xl'>YOUR PROJECTS</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {
                    [1, 2, 3].map((i) => {
                        return <Skeleton key={i} className="h-36 rounded-lg w-full" />
                    })
                }
            </div>
        </div>
    }

    if (!projects || projects.length === 0) {
        return null
    }
    return (
        <div className='w-full mt-16'>
            <h2 className='text-2xl font-bold text-center mb-5 md:text-3xl'>YOUR PROJECTS</h2>
            <div className='hidden lg:grid grid-cols-3 gap-4 max-w-4xl mx-auto'>
                {
                    projects.map((item) => {
                        return <Link href={`/projects/${item.id}`} key={item.id}>
                            <Card key={item.id} className={"hover:shadow-xl transition-all duration-300"}>
                                <CardHeader>
                                    <div className='flex flex-col items-center justify-between p-4'>
                                        <FolderKanban />
                                        <div>
                                            <CardTitle>{item.name}</CardTitle>

                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Calendar />
                                    <span>{formatDate(item.createdAt)}</span>
                                </CardContent>

                            </Card>
                        </Link>
                    })
                }
            </div>
        </div>
    )
}
