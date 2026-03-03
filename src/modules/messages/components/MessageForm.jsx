"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextAreaAutoSize from "react-textarea-autosize";

import { toast, Toaster } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { cn } from "../../../lib/utils";
import { Button } from "@/components/ui/button";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useCreateMessage } from "../hooks/messages";



const fromSchema = z.object({
    content: z.string().min(2, "DESCRIPTION REQUIRED").max(1000, "TOO LONG...."),
});
const MessageForm = ({ projectId }) => {

    const [focused, setFocused] = useState(false);
    const form = useForm({
        resolver: zodResolver(fromSchema),
        defaultValues: {
            content: "",
        },
        mode: "onChange",
    });


    const { mutateAsync, isLoading } = useCreateMessage(projectId)

    const onSubmit = async (values) => {
        try {
            console.log(values)
            const result = await mutateAsync(values.content)

            toast.success("messgae created successfully")
            form.reset()
        } catch (error) {
            toast.error("Something went wrong")
        }
    };


    return (
        <div className="flex flex-col items-center space-y-8 mt-3">
            <Toaster />


            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex flex-col items-center space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="w-full flex justify-center">
                                <FormControl>
                                    <div
                                        className={cn(
                                            "relative w-full max-w-3xl",
                                            "rounded-2xl shadow-lg transition-all",
                                            focused && "ring-2 ring-black-500",
                                        )}
                                    >
                                        {/* Textarea */}
                                        <TextAreaAutoSize
                                            onFocus={() => setFocused(true)}
                                            onBlur={() => setFocused(false)}
                                            {...field}
                                            minRows={3}
                                            maxRows={6}
                                            placeholder="type message here"
                                            className={cn(
                                                "w-full resize-none bg-transparent",
                                                "px-6 py-4 pr-14", // space for button
                                                "text-sm text-black",
                                                "placeholder:text-gray-400",
                                                "focus:outline-none rounded-2xl font-mono",
                                            )}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    form.handleSubmit(onSubmit)();
                                                }
                                            }}
                                        />

                                        <Button
                                            type="submit"
                                            className={cn(
                                                "absolute bottom-3 right-3",
                                                "flex items-center justify-center",
                                                "h-9 w-9 rounded-lg",
                                                "bg-black text-white",
                                                "hover:bg-gray-800",
                                                "transition",
                                                isLoading && "bg-muted-foreground border"
                                            )}

                                            disabled={isLoading}>
                                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-4 w-4"
                                            >
                                                <path d="M5 12h14" />
                                                <path d="M12 5l7 7-7 7" />
                                            </svg>}
                                        </Button>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
};

export default MessageForm;
