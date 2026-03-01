import { AwardIcon } from "lucide-react";
import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "agent/hello" },
  async () => {
    const agent = createAgent({
      model: gemini({ model: "gemini-2.5-flash" }),
      name: "hello-agent",
      description: "agent that adds",
      system: "you add numbers"
    })

    const { output } = await agent.run("whats 2+2");
    console.log(output);
    return {
      message: output[0].content
    }
  }
);