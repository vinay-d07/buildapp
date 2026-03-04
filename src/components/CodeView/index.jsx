import { useEffect } from "react";
import Prism from "prismjs";

import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-javascript";

import "./codetheme.css";


export const CodeView = ({ code, lang = "javascript" }) => {
    useEffect(() => {
        if (code) {
            console.log("code", code)
            Prism.highlightAll()
        }
    }, [code])

    return (
        <pre className="p-2 bg-transparent border-none rounded-lg text-sm">
            <code className={`language-${lang}`}>{code}</code>
        </pre>
    )
}