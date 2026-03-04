import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,

} from "@/components/ui/tooltip"

export function Hint({ children, text, side, allign }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} allign={allign}>
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
