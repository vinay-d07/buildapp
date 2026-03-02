export const lasttextUtil = (result) => {
    const lastIdx = result.output.findIndex((item) => item.role === "assistant")

    const message = result.output[lastIdx]

    return message?.content ? typeof message.content === "string" ? message.content : message.content.map((item) => item.text).join("") : undefined
}