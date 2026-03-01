"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextAreaAutoSize from "react-textarea-autosize";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { cn } from "../../../lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { invoke } from "../actions";

const fromSchema = z.object({
  content: z.string().min(2, "DESCRIPTION REQUIRED").max(1000, "TOO LONG...."),
});
const ProjectForm = () => {
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const form = useForm({
    resolver: zodResolver(fromSchema),
    defaultValues: {
      content: "",
    },
  });

  const templates = [
    {
      name: "E-commerce Website",
      description: "A website for buying and selling products online.",
    },
    {
      name: "Social Media App",
      description: "An app for connecting with friends and sharing updates.",
    },
    {
      name: "Project Management Tool",
      description: "A tool for managing tasks and collaborating with teams.",
    },

    // Added templates 👇

    {
      name: "Portfolio Website",
      description:
        "A personal website to showcase projects, skills, and experience.",
    },
    {
      name: "Blog Platform",
      description:
        "A platform for writing, publishing, and managing blog posts.",
    },
    {
      name: "Learning Management System",
      description:
        "An app for creating courses, tracking progress, and managing students.",
    },
  ];

  const invokeAI = async () => {
    try {
      const res = await invoke();
      console.log(res);
      toast.success("RESULT+++++")
    } catch (error) {
      toast.error("ERROR")
      console.log(error)
    }
  }
  const onSubmit = async (values) => {

  };
  return (
    <div className="flex flex-col items-center space-y-8 mt-3">
      <Toaster />
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 items-center justify-center w-4/5">
        {templates.map((template) => (
          <div
            key={template.name}
            className="border rounded-lg h-40 m-2 overflow-hidden p-5 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
        ))}
      </div>
      <div className="relative my-6">
        {/* Line */}
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>

        {/* Text */}
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">
            Describe your own ideas
          </span>
        </div>
      </div>
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
                      placeholder="e.g. A task management app for remote teams"
                      className={cn(
                        "w-full resize-none bg-transparent",
                        "px-6 py-4 pr-14", // space for button
                        "text-sm text-black",
                        "placeholder:text-gray-400",
                        "focus:outline-none rounded-2xl",
                      )}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                    <Button onClick={invokeAI}>Invoke</Button>
                    <Button
                      type="submit"
                      className={cn(
                        "absolute bottom-3 right-3",
                        "flex items-center justify-center",
                        "h-9 w-9 rounded-lg",
                        "bg-black text-white",
                        "hover:bg-gray-800",
                        "transition",
                      )}
                    >
                      {/* SVG Icon */}
                      <svg
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
                      </svg>
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

export default ProjectForm;
