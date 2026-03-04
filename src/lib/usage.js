import { RateLimiterPrisma } from "rate-limiter-flexible";

import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
export const FREE_POINTS = 5;
export const PRO_POINTS = 5;
export const DURATION = 30 * 24 * 60 * 60;
export const COST = 1;


export async function getUsageTracker() {

    const { has } = await auth();
    const proPlan = has({ plan: "pro_plan" })
    const usageTracker = new RateLimiterPrisma({
        storeClient: db,
        tableName: "Usage",
        points: proPlan ? PRO_POINTS : FREE_POINTS,
        duration: DURATION
    })

    return usageTracker;
}

export async function consumeCredits() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("UNAUTHORIZED")
    }
    const usageTracker = await getUsageTracker()
    const results = await usageTracker.consume(userId, COST)
    return results
}

export async function getUsageStatus() {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("UNAUTHORIZED")
    }
    const usageTracker = await getUsageTracker()

    try {
        const res = await usageTracker.get(userId);
        if (!res) {
            return null;
        }
        return res
    } catch (error) {
        console.log(error)
        return null
    }
}