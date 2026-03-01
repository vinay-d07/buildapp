import "dotenv/config";
import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "my-app",
  baseUrl: process.env.INNGEST_API_URL || "http://localhost:8288"
});