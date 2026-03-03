
import { ProjectView } from '@/modules/projects/components/ProjectView'
import React from 'react'

export default async function ProjectPage({ params }) {
    const { id } = await params
    return (
        <div className='h-full w-full ' >
            <ProjectView id={id} />
        </div>
    )
}
