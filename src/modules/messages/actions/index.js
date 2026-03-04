"use server"
import { MessageType, MessageRole } from "@/generated/prisma/enums"
import { db } from "@/lib/db"
import { inngest } from "../../../../inngest/client"
import { getUser } from "@/modules/auth"
import { consumeCredits } from "@/lib/usage"

export const createMessage = async (value, projectId) => {
    const user = await getUser()
    if (!user) {
        throw new Error("Unauthorized")
    }
    const proj = await db.project.findUnique({
        where: {
            id: projectId,
            userId: user.user.id
        }
    })
    if (!proj) {
        throw new Error("Project not found")
    }
    try {
        await consumeCredits()
    } catch (error) {
        if (error instanceof Error) {
            throw new Error({
                code: "BAD_REQUEST",
                message: "Something went wrong"
            })
        } else {
            throw new Error({
                code: "TOO_MANY_REQUESTS",
                message: "Too many requests"
            })
        }
    }
    const newMessage = await db.message.create({
        data: {
            projectId: projectId,
            role: MessageRole.USER,
            type: MessageType.RESULT,
            content: value
        }
    })
    await inngest.send({
        name: "code-agent/run",
        data: {
            projectId: projectId,
            value: value,
        },
    })

    return newMessage
}

export const getMessages = async (projectId) => {
    const user = await getUser()
    if (!user) {
        throw new Error("NO USER FOUND");
    }
    const proj = await db.project.findUnique({
        where: {
            id: projectId,
            userId: user.user.id
        }
    })
    if (!proj) {
        throw new Error("PROJECT NOT FOUND")
    }
    const messages = await db.message.findMany({
        where: {
            projectId: projectId,
        },
        orderBy: {
            createdAt: "asc"
        },
        include: {
            fragments: true
        }
    })
    return messages
}