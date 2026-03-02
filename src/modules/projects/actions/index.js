"use server"

import { inngest } from "../../../../inngest/client"
import { db } from "@/lib/db"
import { getUser } from "@/modules/auth"
import { generateSlug } from "random-word-slugs"
import { MessageRole, MessageType } from "@/generated/prisma/client"

export const createProject = async (value) => {
    try {
        const user = await getUser();
        console.log("USER IN PROJECT SERVER ACTIONS :", user)
        if (!user) {
            throw new Error("Unauthorized")
        }
        const newProject = await db.project.create({
            data: {
                name: generateSlug(2, { format: "kebab" }),
                userId: user.user.id,
                messages: {
                    create: {
                        content: value,
                        role: MessageRole.USER,
                        type: MessageType.RESULT
                    }
                }
            }
        })

        await inngest.send({
            name: "code-agent/run",
            data: {
                projectId: newProject.id,
                value: value
            }
        });
        return newProject
    } catch (error) {
        console.log(error)
        return null
    }
}
export const getProjects = async () => {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized")
    }
    const projects = await db.project.findMany({
        where: {
            userId: user.user.id
        }, orderBy: {
            createdAt: "desc"
        }
    })
    return projects
}

export const getProjectById = async (projectId) => {
    const user = await getUser();
    if (!user) {
        throw new Error("Unauthorized")
    }
    const project = await db.project.findUnique({
        where: {
            id: projectId,
            userId: user.user.id
        }, orderBy: {
            createdAt: "desc"
        }
    })
    return project
}
