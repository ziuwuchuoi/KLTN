import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Components } from "react-markdown";

type MarkdownRendererProps = {
    content: string;
};

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    const components: Components = {
        code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            if (match) {
                return (
                    <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="p" {...props}>
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                );
            }

            return (
                <code className="px-1 py-0.5 rounded text-blue-300 text-base font-medium" {...props}>
                    {children}
                </code>
            );
        },
    };

    return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
};

export default MarkdownRenderer;
