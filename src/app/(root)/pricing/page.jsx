"use client"
import { useCurrtheme } from "@/hooks/useCurrtheme"
import { PricingTable } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function page() {
    const currTheme = useCurrtheme()
    return (<>
        <div className="w-full h-screen  flex items-center flex-col p-8 justify-center">

            <div className="max-w-5xl w-full">
                <section className="flex flex-col space-y-8 items-center">
                    <h1 className="text-xl md:text-3xl font-bold dark:invert-0">PRICING</h1>
                    <p className="font-mono text-muted-foreground text-center">choose your plan</p>
                    <PricingTable appearance={{
                        baseTheme: currTheme == "dark" ? dark : undefined,
                        elements: {
                            pricingTableCard: "border! shadow-none! rounded-lg!"
                        }
                    }} />
                </section>
            </div>

        </div>
    </>)
}