import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { CrownIcon, Loader } from "lucide-react";
import { useStatus } from "../hooks/usage";
import Link from "next/link";
import { formatDuration, intervalToDuration } from "date-fns";

export const Usage = () => {
    const { data, isLoading, error } = useStatus()
    const { has } = useAuth()
    const hasAccess = has({ plan: "pro_plan" })

    if (isLoading) {
        return <div className="flex items-center justify-center"><Loader /></div>
    }
    if (error) {
        return <div className="flex items-center justify-center">{error.message}</div>
    }
    const { remainingPoints, msBeforeReset } = data
    const duration = intervalToDuration({ start: 0, end: msBeforeReset })
    const formattedDuration = formatDuration(duration, { format: ["hours", "minutes", "seconds"], })

    return (
        <div className="rounded-lg bg-background w-full h-10 flex p-2 justify-between">
            <div>
                <p className="text-sm font-semibold">Remaining Points</p>
                <p className="text-lg font-bold">{remainingPoints}</p>
            </div>
            <div>
                <p className="text-sm font-semibold">Reset In</p>
                <p className="text-lg font-bold">{formattedDuration}</p>
            </div>
            {
                !hasAccess && (
                    <Button className="w-auto" size="sm" variant="outline" asChild>
                        <Link href="/pricing">Upgrade to Pro<CrownIcon className="ml-2" /></Link>
                    </Button>
                )
            }

        </div>
    )
}