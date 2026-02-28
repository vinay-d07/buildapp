"use server"

import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
export const onBoardUser = async () => {
    try {
        console.log("onBoardUser called")
        const user = await currentUser()
        if (!user) {
            return { success: false, message: "User not found" }
        }

        const { id, firstName, lastName, emailAddresses, imageUrl } = user


        const newUser = await db.user.upsert({
            where: {
                clerkId: id
            }, update: {
                clerkId: id,
                name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null,
                email: emailAddresses[0]?.emailAddress || ""
            }, create: {
                clerkId: id,
                name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || null,
                email: emailAddresses[0]?.emailAddress || ""
            }
        })

        return { success: true, user: newUser, message: "user created !!" }
    } catch (error) {
        console.log(error)
        return { success: false, message: "Internal server error" }
    }
}

export const getUser = async () => {
    try {
        const user = await currentUser()
        if (!user) {
            return { success: false, message: "User not found" }
        }

        const { id } = user

        const foundUser = await db.user.findUnique({
            where: {
                clerkId: id
            }
        })

        return { success: true, user: foundUser }
    } catch (error) {
        console.log(error)
        return { success: false, message: "Internal server error" }
    }
}