import { inngest } from "./client";
import { gemini, createAgent, createTool, createNetwork } from "@inngest/agent-kit";

import Sandbox from "e2b";
import z from "zod";
import { PROMPT, FRAGMENT_TITLE_PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { lasttextUtil } from "./utils";
import { db } from "@/lib/db";
import { MessageRole, MessageType } from "@/generated/prisma/enums";

export const codeAgent = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    console.log("EVENT RECIEVED")
    const sandBoxID = await step?.run("get-sandbox-id-v2", async () => {
      try {

        const sandBox = await Sandbox.create(
          "iamjohnwick944/next-js-template-v2",
          {
            apiKey: process.env.E2B_API_KEY
          }
        );
        return sandBox.sandboxId
      } catch (error) {
        throw error
      }
    })

    const agent = createAgent({
      model: gemini({ model: "gemini-2.5-flash" }),
      name: "code-agent",
      description: "a coding expert",
      system: PROMPT,
      tools: [
        createTool({
          name: "terminal",
          description: "run a command in the terminal",
          parameters: z.object({
            command: z.string().describe("the command to run")
          }),
          handler: async (command, step) => {
            return await step?.run("run-command", async () => {
              try {
                const buffers = { stdout: "", stderr: "" }
                const sandBox = await Sandbox.connect(sandBoxID)
                const process = await sandBox?.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data
                  },
                  onStderr: (data) => {
                    buffers.stderr += data
                  }
                })
                return process.stdout
              } catch (error) {
                return `Command failed with error: ${error.message} \n stderr: ${buffers.stderr} \n stdout: ${buffers.stdout}`
              }
            })
          }
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "tool for files",
          parameters: z.object({
            files: z.array(z.object({
              path: z.string().describe("path of the file"),
              content: z.string().describe("content of the file")
            }))
          }),
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run("create-update-files", async () => {
              try {
                const updatedFiles = network?.state.data.files || {}
                const sandBox = await Sandbox.connect(sandBoxID)
                for (const file of files) {
                  await sandBox?.files.write(file.path, file.content)
                  updatedFiles[file.path] = file.content
                }
                return updatedFiles
              } catch (error) {
                return error
              }
            })
            if (typeof newFiles === "object") {
              if (network && network.state && network.state.data) {
                network.state.data.files = newFiles
              }
            }

          }
        }),
        createTool({
          name: "file-reader",
          description: "reads file",
          parameters: z.object({
            files: z.array(z.string().describe("path of the file"))
          }),
          handler: async ({ files }, { step, network }) => {
            return await step?.run("readfile", async (step) => {
              try {
                const sandBox = await Sandbox.connect(sandBoxID)
                let content = []
                for (const file of files) {
                  const fileContent = await sandBox?.files.read(file)
                  content.push({ path: file, content: fileContent || "" })
                }
                return JSON.stringify(content)
              } catch (error) {
                return error
              }
            })
          }
        })
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessge = lasttextUtil(result)

          if (!network?.state?.data) return result
          if (!lastAssistantMessge?.includes("<task_summary>")) return result

          network.state.data.summary = lastAssistantMessge

          return result
        }
      }
    })
    const network = createNetwork({

      name: "file-network",
      agents: [agent]
      , maxIter: 5,

      router: async ({ network }) => {
        const summary = network?.state.data.summary;
        if (summary) {
          return "file-network"
        }
        return agent
      }
    })

    const input = event.data?.value ?? "Begin the coding task."
    const result = await network.run(input)


    //title agent
    const titleAgent = createAgent({
      name: "fragment-title-generator",
      model: gemini({ model: "gemini-2.5-flash" }),
      system: FRAGMENT_TITLE_PROMPT
    })

    const { output: fragmentTitle } = await titleAgent.run(result.state.data.summary)
    const generateTitle = async () => {
      if (fragmentTitle[0].type !== "text") {
        return "untitled"
      }
      if (isArray(fragmentTitle[0].content)) {
        return fragmentTitle[0].content.map((item) => item.text).join(" ")
      } else {
        return fragmentTitle[0].content
      }

    }

    //response agent
    const responseAgent = createAgent({
      name: "response-agent",
      model: gemini({ model: "gemini-2.5-flash" }),
      system: RESPONSE_PROMPT
    })
    const { output: response } = await responseAgent.run(result.state.data.summary)
    const generateRespone = async () => {
      if (response[0].type !== "text") {
        return ""
      }
      if (isArray(response[0].content)) {
        return response[0].content.map((item) => item.text).join(" ")
      } else {
        return response[0].content
      }
    }


    const isError = !result.state.data.summary || Object.keys(result.state.data.summary || {}).length === 0
    const url = await step?.run("get-url", async () => {
      try {
        const sandBox = await Sandbox.connect(sandBoxID)
        const host = sandBox.getHost(3000)
        return `http://${host}`
      } catch (error) {
        console.error("Failed to get URL:", error)
        return null
      }
    })


    // save each message
    await step.run("save-result", async () => {
      if (isError) {
        return await db.message.create({
          data: {
            projectId: event.data.projectId,
            role: MessageRole.ASSISTANT,
            type: MessageType.ERROR,
            content: "some error occurred"
          }
        })

      }

      return await db.message.create({
        data: {
          projectId: event.data.projectId,
          role: MessageRole.ASSISTANT,
          type: MessageType.RESULT,
          content: generateRespone(),
          fragments: {
            create: {
              sandBoxUrl: url,
              title: generateTitle(),
              files: result.state.data.files,

            }
          }
        }
      })
    })

    return {
      url: url,
      title: generateTitle(),
      files: result.state.data.files,
      summary: result.state.data.summary
    }
  }
);