"use server"
import { DURATION, FREE_POINTS, getUsageStatus, PRO_POINTS, consumeCredits } from "@/lib/usage";
import { auth } from "@clerk/nextjs/server";

export const status = async () => {
    try {
        const { userId, has } = await auth()
        if (!userId) {
            throw new Error("UNAUTHORISED")
        }
        const hasAccess = has({ plan: "pro_plan" })
        const maxPoints = hasAccess ? PRO_POINTS : FREE_POINTS
        const usageStatus = await getUsageStatus()
        if (!usageStatus) {
            return {
                remainingPoints: maxPoints,
                msBeforeReset: DURATION * 1000,
                consumedPoints: 0,
                isFirstRequest: true,
                maxPoints: maxPoints
            }
        }

        const remainingPoints = usageStatus.remainingPoints ?? maxPoints - usageStatus.consumedPoints
        return {
            remainingPoints: remainingPoints,
            msBeforeReset: usageStatus.msBeforeNext || DURATION * 1000,
            consumedPoints: usageStatus.consumedPoints,
            isFirstRequest: false,
            maxPoints: maxPoints
        }
    } catch (error) {
        console.log(error)
        throw error
    }

}

export const consume = async () => {
    return await consumeCredits()
}